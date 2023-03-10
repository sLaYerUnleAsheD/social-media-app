import { Box } from "@mui/material";
import { styled } from "@mui/system";

// below is a syntax for resuing css as a component with the
// help of mui, I can name it as I want and use it as a component
const FlexBetween = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
});
// I can now use this component many times
// to center and align things in proper locations
export default FlexBetween;