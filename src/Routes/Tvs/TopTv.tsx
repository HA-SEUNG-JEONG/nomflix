import { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { getTopTv, IGetTvResult, DEFAULT_IMG } from "../../api";
import { useQuery, useInfiniteQuery } from "react-query";
import { makeImagePath } from "../../utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import {
  faChevronLeft,
  faChevronRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled(motion.div)`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Slider = styled.div`
  position: relative;
  top: -9.3rem;
  margin-bottom: 15rem;
`;

const SliderTitle = styled.div`
  font-family: "Cafe24SsurroundAir";
  margin-bottom: 2rem;
  margin-left: 4rem;
  font-size: 1.5rem;
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

const Row = styled(motion.div)`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  padding: 0 4rem;
`;

const Box = styled(motion.div)`
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

const MovieImg = styled(motion.img)`
  border-radius: 0.5rem;
  width: 100%;
`;

const Info = styled(motion.div)`
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px 0.125rem 25px rgba(0, 0, 0, 0.5);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  padding: 1rem;
`;

const MovieTitle = styled.div``;
const MovieVote = styled.div`
  width: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const rowVariants = {
  hidden: (back: boolean) => ({
    x: back ? -window.innerWidth : window.innerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: (back: boolean) => ({
    x: back ? window.innerWidth : -window.innerWidth,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.5,
    y: -50,
    transition: {
      delay: 0.3,
      duration: 0.2,
      type: "tween",
    },
  },
};

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

const offset = 6;

function TopTv() {
  const history = useHistory();
  const [topIndex, setTopIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const { data: topData, isLoading: topLoading } =
    useInfiniteQuery<IGetTvResult>(["tv", "top-rated"], getTopTv);

  const increaseTopIndex = () => {
    if (topData) {
      if (leaving) return;
      setBack(false);
      toggleLeaving();
      const totalTv = topData.pages.map((page) => page.results).length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseTopIndex = () => {
    if (topData) {
      if (leaving) return;
      setBack(true);
      toggleLeaving();
      const totalTv = topData.pages.map((page) => page.results).length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setTopIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const onClickedBox = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };

  return (
    <Wrapper>
      {topLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider>
          <SliderTitle>Top Rated</SliderTitle>
          <Prev whileHover={{ opacity: 1 }} onClick={decreaseTopIndex}>
            <FontAwesomeIcon icon={faChevronLeft} size="2x" />
          </Prev>
          <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
            <Row
              custom={back}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={topIndex}
            >
              {topData?.pages
                .map((page) => page.results)
                .flat()
                .slice(offset * topIndex, offset * topIndex + offset)
                .map((tv) => (
                  <Box
                    layoutId={"toptv_" + tv.id}
                    key={tv.id}
                    variants={boxVariants}
                    whileHover="hover"
                    initial="normal"
                    transition={{ type: "tween" }}
                    onClick={() => onClickedBox(tv.id)}
                  >
                    <MovieImg
                      variants={movieImgVariants}
                      src={
                        tv.backdrop_path
                          ? makeImagePath(tv.backdrop_path, "w500")
                          : DEFAULT_IMG
                      }
                    />

                    <Info variants={infoVariants}>
                      <MovieTitle>{tv.name}</MovieTitle>
                      <MovieVote>
                        <FontAwesomeIcon
                          icon={faStar}
                          size="xs"
                          color="orange"
                        />
                        <div>{tv.vote_average}</div>
                      </MovieVote>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
          <Next whileHover={{ opacity: 1 }} onClick={increaseTopIndex}>
            <FontAwesomeIcon icon={faChevronRight} size="2x" />
          </Next>
        </Slider>
      )}
    </Wrapper>
  );
}

export default TopTv;
