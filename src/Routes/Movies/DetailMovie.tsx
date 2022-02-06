import { getMovies, IGetMovieDetailResult } from "../../api";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getMovieDetail, DEFAULT_IMG } from "./../../api";
import { AnimatePresence, useViewportScroll, motion } from "framer-motion";
import { useQuery } from "react-query";
import { useEffect } from "react";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { isDetail } from "./../../atom";
import { makeImagePath } from "./../../utilities";

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const DetailInfo = styled.div`
  font-family: "Cafe24SsurroundAir";
  color: ${(props: any) => props.theme.white.lighter};
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
  padding-top: ${(props: any) => (props.tagline ? "1.5rem" : "2rem")};
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

const Tagline = styled.div`
  width: 45%;
`;

const BigMovieDetail = styled(motion.div)`
  position: absolute;
  border-radius: 1rem;
  overflow: auto;
  width: 47vw;
  height: 100vh;
  top: 10px;
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

function DetailMovie() {
  const history = useHistory();
  const MovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const setDetail = useSetRecoilState(isDetail);

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

  const onClickedOverlay = () => {
    history.push("/");
    setDetail(false);
  };

  return (
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
                        <div style={{ marginBottom: "1rem" }}>
                          {detailData.overview}
                        </div>
                        <button
                          style={{
                            marginBottom: "1rem",
                            backgroundColor: "yellow",
                            borderRadius: "0.5rem",
                            fontWeight: "600",
                            padding: "0.5rem",
                          }}
                        >
                          <a
                            href={`${detailData.homepage}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Main Page
                          </a>
                        </button>
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
  );
}

export default DetailMovie;
