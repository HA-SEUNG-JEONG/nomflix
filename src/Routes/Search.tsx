import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  getMovieDetail,
  IGetMovieDetailResult,
} from "../api";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { makeImagePath } from "./../utilities";
import { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSetRecoilState } from "recoil";
import { isDetail } from "../atom";
import { DEFAULT_IMG, searchMovie, searchTv } from "../api";
import { useLocation } from "react-router";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled(motion.div)`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-family: "Cafe24SsurroundAir";
  font-size: 5rem;
  margin-bottom: 2rem;
`;

const OverView = styled.p`
  font-family: "Cafe24SsurroundAir";
  font-size: 1.5rem;
  width: 50%;
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

const BigMovieDetail = styled(motion.div)`
  font-family: "Cafe24SsurroundAir";
  position: absolute;
  border-radius: 1rem;
  overflow: hidden;
  width: 40vw;
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
`;

const DetailInfo = styled.div`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -5.5rem;
  padding: 1.5rem 1.5rem 0 1.5rem;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const DetailTitle = styled.h3`
  font-size: 2rem;
  width: 60%;
`;

const Tagline = styled.div`
  width: 40%;
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

const MovieTitle = styled.div`
  font-family: "Cafe24SsurroundAir";
`;

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

export const Search = () => {
  const history = useHistory();
  const location = useLocation();
  const bigMovieMatch =
    useRouteMatch<{ movieId: string }>("/search/:keywordId");
  const { scrollY } = useViewportScroll();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetMoviesResult>(
      ["movies", keyword],
      async () => keyword && searchMovie(keyword)
    );
  const { data: tvData, isLoading: tvLoading } = useQuery<IGetMoviesResult>(
    ["tv", keyword],
    async () => keyword && searchTv(keyword)
  );

  const {
    data: searchData,
    isLoading: searchLoading,
    refetch,
  } = useQuery<IGetMovieDetailResult>(
    ["movies", bigMovieMatch?.params.movieId],
    async () => bigMovieMatch && getMovieDetail(bigMovieMatch?.params.movieId),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (bigMovieMatch?.params.movieId) {
      refetch();
    }
  }, [bigMovieMatch?.params.movieId, refetch]);

  const [index, setIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const setDetail = useSetRecoilState(isDetail);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = () => {
    if (movieData) {
      if (leaving) return;
      setBack(false);
      toggleLeaving();
      const totalMovies = movieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const increaseTopIndex = () => {
    if (tvData) {
      if (leaving) return;
      setBack(false);
      toggleLeaving();
      const totalMovies = tvData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
    setTimeout(() => setDetail(true), 500);
  };

  const onOverlayClick = () => {
    history.push("/");
    setDetail(false);
  };

  return (
    <Wrapper>
      {movieLoading && tvLoading && movieData?.results && tvData?.results ? (
        <Loader>?????? ????????? ????????????.</Loader>
      ) : movieData || tvData ? (
        <>
          {movieData && movieData.total_results > 0 && (
            <>
              <Banner
                bgPhoto={makeImagePath(
                  movieData?.results[0].backdrop_path || ""
                )}
              >
                <Title>{movieData?.results[0].title}</Title>
                <OverView>{movieData?.results[0].overview}</OverView>
              </Banner>
              <Slider>
                <SliderTitle>{keyword}??? ?????? ??????</SliderTitle>

                <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
                  <Row
                    custom={back}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={index}
                  >
                    {movieData?.results
                      .slice(offset * index, offset * index + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          key={movie.id}
                          variants={boxVariants}
                          whileHover="hover"
                          initial="normal"
                          transition={{ type: "tween" }}
                          onClick={() => onBoxClicked(movie.id)}
                        >
                          <MovieImg
                            variants={movieImgVariants}
                            src={makeImagePath(movie.backdrop_path, "w500")}
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
            </>
          )}
          {tvData && tvData.total_results > 0 && (
            <>
              <Slider>
                <SliderTitle>{keyword}??? ?????? TV ?????????</SliderTitle>
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
                    {tvData?.results
                      .slice(offset * topIndex, offset * topIndex + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          key={movie.id}
                          variants={boxVariants}
                          whileHover="hover"
                          initial="normal"
                          transition={{ type: "tween" }}
                          onClick={() => onBoxClicked(movie.id)}
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
                            <MovieTitle>{movie.name}</MovieTitle>
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
            </>
          )}

          <AnimatePresence>
            {searchLoading ? (
              <Loader>Loading...</Loader>
            ) : (
              bigMovieMatch && (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                  <BigMovieDetail
                    style={{ top: scrollY.get() + 50 }}
                    layoutId={bigMovieMatch.params.movieId}
                  >
                    {searchData && (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(transparent, black), url(${
                              searchData.backdrop_path
                                ? makeImagePath(searchData.backdrop_path)
                                : DEFAULT_IMG
                            })`,
                          }}
                        ></BigCover>
                        <DetailInfo>
                          <DetailHeader>
                            <DetailTitle>{searchData.title}</DetailTitle>
                            <Tagline>{searchData.tagline}</Tagline>
                          </DetailHeader>
                          <DetailBody tagline={Boolean(searchData.tagline)}>
                            <DetailPoster
                              style={{
                                backgroundImage: `url(${makeImagePath(
                                  searchData.poster_path
                                )})`,
                              }}
                            />
                            <DetailSection>
                              <div>{searchData.overview}</div>
                              <a
                                href={`${searchData.homepage}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {searchData.homepage}
                              </a>
                              <div>
                                ?????? :{" "}
                                {searchData.genres.map((genre) => (
                                  <span>{genre.name} </span>
                                ))}
                              </div>
                              <div>?????? ?????? : {searchData.release_date}</div>
                              <div>?????? ?????? : {searchData.runtime} ???</div>
                              <div>?????? ?????? : {searchData.status}</div>
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
      ) : (
        <>
          {console.log("123")}
          <div>?????? ????????? ?????? ??? ????????????</div>
        </>
      )}
    </Wrapper>
  );
};
