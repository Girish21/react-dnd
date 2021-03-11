import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import "./App.css";

const StyledDiv = styled.div`
  ${tw`w-full h-screen`}
  background: hotpink;
`;

function App() {
  return <StyledDiv />;
}

export default App;
