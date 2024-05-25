import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Autocomplete from './Autocomplete';
import NavLink from './NavLink';

const Container = styled.div``;

const HeaderContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  height: 50px;
`;

const UserSearchContainer = styled.div`
  width: 100%;
  background: #fff;
`;
const UserSearch = styled.div`
  display: flex;
  height: 50px;
  justify-content: space-between;
  max-width: 800px;
  width: 100%;
  margin: auto;
  line-height: 40px;
  a,
  span {
    line-height: 50px;
  }
`;
const Header = styled.div`
  background: #fff18f;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 80px;
  font-weight: 500;
`;

const Logo = styled.a`
  text-decoration: none;
  color: #000;
  &:active {
    color: #000;
  }
  &:visited {
    color: #000;
  }

  &:hover {
    color: #df4848;
  }
`;

const Links = styled.div`
  width: 300px;
  display: flex;
  margin-left: 20px;
  justify-content: space-between;
  a {
    text-decoration: none;
    color: #000;
    &:visited {
      color: #000;
    }
  }
`;

const Content = styled.div`
  max-width: 800px;
  margin: auto;
  margin-top: 100px;
  padding: 20px;
`;

const UserSelect = styled.div`
  display: inline-block;
  margin-left: 10px;
  padding: 5px;
  border-radius: 5px;
  width: 140px;
`;

export default function Layout({ children }) {
  const router = useRouter();
  const parts = router.asPath.split('/');
  const path = parts[2];
  const [username, setUsername] = useState(parts[1]);
  console.log({ username });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/resumes');
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const onChangeUsername = (value) => {
    Router.push(
      {
        pathname: `/${value}/${path}`,
      },
      undefined,
      { shallow: true }
    );
    setUsername(value);
  };

  // rmember to cache the users api
  return (
    <>
      <Container>
        <Header>
          <HeaderContainer>
            <Logo href="https://jsonresume.org" target="__blank">
              JSON Resume AI
            </Logo>
            <Links>
              <NavLink href={`/${username}/jobs`}>Jobs</NavLink>
              <NavLink href={`/${username}/interview`}>Interview</NavLink>
              <NavLink href={`/${username}/letter`}>Letter</NavLink>
              <NavLink href={`/${username}/suggestions`}>Suggestions</NavLink>
            </Links>
          </HeaderContainer>
          <UserSearchContainer>
            <UserSearch>
              <div>
                Using the resume of
                <UserSelect>
                  <Autocomplete
                    defaultValue={username}
                    onChange={onChangeUsername}
                    suggestions={users.map((user) => user.username)}
                  />
                </UserSelect>
              </div>
              <Links style={{ width: 180 }}>
                <NavLink href={`/${username}`}>View resume</NavLink>
                <NavLink href={`/${username}.json`}>View raw</NavLink>
              </Links>
            </UserSearch>
          </UserSearchContainer>
        </Header>
        <Content>{children}</Content>
      </Container>

      <script
        async
        data-id="101412017"
        src="https://static.getclicky.com/js"
      ></script>
      <noscript>
        <p>
          <Image
            alt="Clicky"
            width="1"
            height="1"
            src="https://in.getclicky.com/101412887ns.gif"
          />
        </p>
      </noscript>
      <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
          background-color: #f5f5f5;
          font-family: 'Open Sans', sans-serif;
        }
      `}</style>
    </>
  );
}
