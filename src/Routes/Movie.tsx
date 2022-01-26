import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useInfiniteQuery, useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovies,
  IGetMoviesResult,
  getTopRatedMovies,
  IGetMovieDetailResult,
  getMovieDetail,
  DEFAULT_IMG,
} from "../api";
import { makeImagePath } from "../utilities";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { isDetail } from "../atom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  background: black;
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
  top: -9.3rem;
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

const Tagline = styled.div`
  width: 45%;
`;

const BigMovieDetail = styled(motion.div)`
  position: absolute;
  border-radius: 1rem;
  overflow: auto;
  width: 47vw;
  height: 90vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  height: 35%;

  background-size: cover;
  background-position: center center;
  height: 500px;
`;

const DetailInfo = styled.div`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -5rem;
  padding: 1.5rem 1.5rem 1.5rem 0.9rem;
  height: 50%;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const DetailTitle = styled.h3`
  font-size: 0.9rem;
  width: 66%;
`;

const DetailBody = styled.div<{ tagline: boolean }>`
  padding-top: ${(props) => (props.tagline ? "1.5rem" : "2rem")};
  display: grid;
  height: 100%;
  grid-template-columns: repeat(2, 1fr);
`;

const DetailPoster = styled.div`
  border-radius: 1rem;
  height: 30rem;
  background-position: center;
  background-size: cover;
`;

const DetailSection = styled.div`
  padding: 1.5rem;
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
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
  const MovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const { data, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteQuery<IGetMoviesResult>(["movies", "now_playing"], getMovies, {
      getNextPageParam: (currentPage) => {
        const nextPage = currentPage.page + 1;
        return nextPage > currentPage.total_pages ? null : nextPage;
      },
    });

  const {
    data: topData,
    isLoading: topIsLoading,
    hasNextPage: topHasNextPage,
    fetchNextPage: topHasfecthNextPage,
  } = useInfiniteQuery<IGetMoviesResult>(
    ["movies", "top_rated"],
    getTopRatedMovies,
    {
      getNextPageParam: (currentPage) => {
        const nextPage = currentPage.page + 1;
        return nextPage > currentPage.total_pages ? null : nextPage;
      },
    }
  );

  const {
    data: detailData,
    isLoading: detailIsLoading,
    refetch,
  } = useQuery<IGetMovieDetailResult>(
    ["movies", MovieMatch?.params.movieId],
    async () => MovieMatch && getMovieDetail(MovieMatch?.params.movieId),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (MovieMatch?.params.movieId) {
      refetch();
    }
  }, [MovieMatch?.params.movieId, refetch]);

  const [index, setIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const setDetail = useSetRecoilState(isDetail);
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

  const increaseTopIndex = () => {
    if (topData) {
      if (leaving) return;
      setBack(false);
      toggleLeaving();
      const totalMovie = topData.pages.map((page) => page.results).length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      if (topIndex === maxIndex - 1) {
        if (topHasNextPage) {
          topHasfecthNextPage();
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
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const decreaseTopIndex = () => {
    if (topData) {
      if (leaving) return;
      setBack(true);
      toggleLeaving();
      const totalMovie = topData.pages.map((page) => page.results).length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setTopIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const onClickedBox = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onClickedOverlay = () => {
    history.push("/");
    setDetail(false);
  };

  return (
    <Wrapper>
      {isLoading && topIsLoading ? (
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
            <SliderTitle>상영 중인 영화</SliderTitle>
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
                transition={{ ease: "easeInOut", duration: 1 }}
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
                      transition={{ ease: "easeInOut" }}
                      onClick={() => onClickedBox(movie.id)}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <MovieImg
                        variants={movieImgVariants}
                        src={
                          movie.backdrop_path
                            ? makeImagePath(movie.backdrop_path, "w500")
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
              <FontAwesomeIcon icon={faChevronRight} size="2x" />
            </Next>
          </Slider>

          <Slider>
            <SliderTitle>평점 높은 순</SliderTitle>
            <Prev whileHover={{ opacity: 1 }} onClick={decreaseTopIndex}>
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
                key={topIndex}
              >
                {topData?.pages
                  .map((page) => page.results)
                  .flat()
                  .slice(offset * topIndex, offset * topIndex + offset)
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
                          movie.backdrop_path
                            ? makeImagePath(movie.backdrop_path, "w500")
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
            <Next whileHover={{ opacity: 1 }} onClick={increaseTopIndex}>
              <FontAwesomeIcon icon={faChevronRight} size="2x" />
            </Next>
          </Slider>

          <AnimatePresence>
            {detailIsLoading ? (
              <Loader>Loading...</Loader>
            ) : (
              MovieMatch && (
                <>
                  <Overlay
                    onClick={onClickedOverlay}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                  <BigMovieDetail
                    style={{ top: scrollY.get() + 50 }}
                    layoutId={MovieMatch.params.movieId}
                  >
                    {detailData && (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(transparent, black), url(${
                              detailData.backdrop_path
                                ? makeImagePath(detailData.backdrop_path)
                                : DEFAULT_IMG
                            })`,
                          }}
                        ></BigCover>
                        <DetailInfo>
                          <DetailHeader>
                            <DetailTitle>{detailData.title}</DetailTitle>
                            <Tagline>{detailData.tagline}</Tagline>
                          </DetailHeader>
                          <DetailBody tagline={Boolean(detailData.tagline)}>
                            <DetailPoster
                              style={{
                                backgroundImage: `url(${makeImagePath(
                                  detailData.poster_path
                                )})`,
                              }}
                            />
                            <DetailSection>
                              <div>{detailData.overview}</div>
                              <a
                                href={`${detailData.homepage}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {detailData.homepage}
                              </a>
                              <div>
                                장르 :{" "}
                                {detailData.genres.map((genre, index) => (
                                  <span key={index}>{genre.name} </span>
                                ))}
                              </div>
                              <div>개봉 일자 : {detailData.release_date}</div>
                              <div>상영 시간 : {detailData.runtime} 분</div>
                              <div>개봉 여부 : {detailData.status}</div>
                            </DetailSection>
                          </DetailBody>
                        </DetailInfo>
                      </>
                    )}
                  </BigMovieDetail>
                </>
              )
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Movie;
