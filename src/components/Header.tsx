import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  background-color: red;
  height: 80px;
  font-size: 14px;
  font-weight: 600;
`;

const Col = styled.div`
  display: flex;
`;

const Logo = styled.svg`
  margin-right: 20px;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
`;

function Header() {
  return (
    <Nav>
      <Col>
        <Logo />
        <Items>
          <Item>Home</Item>
          <Item>TV</Item>
        </Items>
      </Col>
      <Col>
        <button>Search</button>
      </Col>
    </Nav>
  );
}

export default Header;
