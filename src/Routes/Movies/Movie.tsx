import { motion, AnimatePresence } from "framer-motion";
import { useInfiniteQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult, DEFAULT_IMG } from "../../api";
import { makeImagePath } from "../../utilities";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import TopMovie from "./TopMovie";
import UpcomingMovie from "./UpcomingMovie";
import DetailMovie from "./DetailMovie";

const Wrapper = styled.div`
  background: black;
  height: 240vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;
const MovieTitle = styled.div``;

const MovieImg = styled(motion.img)`
  border-radius: 0.5rem;
  width: 100%;
`;

const Title = styled.h2`
  font-family: "Cafe24SsurroundAir";
  font-style: inherit;
  font-size: 5rem;
  margin-bottom: 20px;
`;

const movieImgVariants = {
  hover: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    transition: {
      delay: 0.3,
      duration: 0.2,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.1,
      type: "tween",
    },
  },
};

const Overview = styled.p`
  font-family: "Cafe24SsurroundAir";
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -20.3rem;
  margin-bottom: 15rem;
`;

const Row = styled(motion.div)`
  font-family: "Cafe24SsurroundAir";
  display: grid;
  gap: 0.2rem;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  position: absolute;
  padding: 0 4rem;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px 2px 25px rgba(0, 0, 0, 0.5);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  padding: 1rem;
`;

const RowVariants = {
  hidden: (back: boolean) => ({
    x: back ? -window.outerWidth + 5 : window.innerWidth,
  }),
  visible: { x: 0 },
  exit: (back: boolean) => ({
    x: back ? window.innerWidth : -window.innerWidth,
  }),
};

const SliderTitle = styled.div`
  font-family: "Cafe24SsurroundAir";
  font-weight: 600;
  margin-bottom: 2rem;
  margin-left: 4rem;
  font-size: 1.5rem;
`;

const Prev = styled(motion.div)`
  height: 80%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.3;
  position: absolute;
  z-index: 10;
  left: 1rem;
  top: 7rem;
`;

const Next = styled(motion.div)`
  height: 80%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.3;
  position: absolute;
  right: 1rem;
  top: 7rem;
  background-color: rgba(0, 0, 0, 1);
`;

const MovieVote = styled.div`
  width: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

function Movie() {
  const history = useHistory();
  const { data, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteQuery<IGetMoviesResult>(["movies", "now_playing"], getMovies, {
      getNextPageParam: (currentPage) => {
        const nextPage = currentPage.page + 1;
        return nextPage > currentPage.total_pages ? null : nextPage;
      },
    });

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setBack(false);
      toggleLeaving();
      const totalMovie = data.pages.map((page) => page.results).length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      if (index === maxIndex - 1) {
        if (hasNextPage) {
          fetchNextPage();
        }
      }
    }
  };

  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setBack(true);
      toggleLeaving();
      const totalMovie = data.pages.map((page) => page.results).length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev - 1));
    }
  };

  const onClickedBox = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              data?.pages.map((page) => page.results).flat()[0].backdrop_path ||
                DEFAULT_IMG
            )}
          >
            <Title>
              {data?.pages.map((page) => page.results).flat()[0].title}
            </Title>
            <Overview>
              {data?.pages.map((page) => page.results).flat()[0].overview}
            </Overview>
          </Banner>
          <Slider>
            <SliderTitle>?????? ?????? ??????</SliderTitle>
            <Prev whileHover={{ opacity: 1 }} onClick={decreaseIndex}>
              <FontAwesomeIcon icon={faChevronLeft} size="2x" />
            </Prev>
            <AnimatePresence
              custom={back}
              onExitComplete={toggleLeaving}
              initial={false}
            >
              <Row
                custom={back}
                variants={RowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.pages
                  .map((page) => page.results)
                  .flat()
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={BoxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      onClick={() => onClickedBox(movie.id)}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <MovieImg
                        variants={movieImgVariants}
                        src={
                          movie.poster_path
                            ? makeImagePath(movie.poster_path, "w500")
                            : DEFAULT_IMG
                        }
                      />

                      <Info variants={infoVariants}>
                        <MovieTitle>{movie.title}</MovieTitle>
                        <MovieVote>
                          <FontAwesomeIcon
                            icon={faStar}
                            size="xs"
                            color="orange"
                          />
                          <div>{movie.vote_average}</div>
                        </MovieVote>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <Next whileHover={{ opacity: 1 }} onClick={increaseIndex}>
              <FontAwesomeIcon
                icon={faChevronRight}
                size="2x"
                style={{
                  position: "relative",
                  bottom: "-5rem",
                }}
              />
            </Next>
          </Slider>

          <TopMovie />
          <UpcomingMovie />
          <DetailMovie />
        </>
      )}
    </Wrapper>
  );
}

export default Movie;
