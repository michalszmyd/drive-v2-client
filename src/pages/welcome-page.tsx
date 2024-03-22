import React, { useContext, useEffect } from "react";
import { css } from "@emotion/css";
import { colors } from "../consts/colors";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "../components/guest/pages/page-wrapper";
import CurrentUserContext from "../contexts/current-user-context";

export default function WelcomePage() {
  const navigate = useNavigate();

  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    if (CurrentUserContext) {
      navigate("/dashboard");
    }
  }, [currentUser]);

  return (
    <PageWrapper className={styles.container}>
      <h1 className={styles.heading}>Drive</h1>
      <span className={styles.description}>Storage for everything</span>
      <div className={styles.buttonWrapper}>
        <Link className={styles.buttonLink} to="/sign-in">
          Sign up
        </Link>
      </div>
    </PageWrapper>
  );
}

const styles = {
  container: css({
    padding: "15%",
  }),
  heading: css({
    color: colors.white,
    fontSize: "48px",
    marginBottom: "14px",
  }),
  description: css({
    fontSize: "28px",
    color: colors.white,
    fontWeight: "300",
  }),
  buttonWrapper: css({
    margin: "44px 0",
  }),
  buttonLink: css(`
    padding: 14px 26px;
    border: 2px solid ${colors.green};
    border-radius: 42px;
    text-decoration: none;
    color: ${colors.green};
    font-weight: 500;

    transition-duration: 0.3s;
    :hover {
      color: ${colors.white};
      background-color: ${colors.green};
    }
  `),
};
