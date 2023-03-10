import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
    // using palette colors that I defined in theme.js
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    return (
        <Box>
            {/* clamp(min val for font, preferred, max) is css function
            it will try to maintain font to preferred but if screen size gets small
            it will go to min, if screen size goes big it will set to max*/}
            <Box 
                width="100%" 
                backgroundColor={theme.palette.background.alt} 
                p="1rem 6%" 
                textAlign="center"
            >
                <Typography
                    fontWeight="bold"
                    fontSize="32px"
                    color="primary"
                >
                    RippleConnect
                </Typography>
            </Box>

            <Box
                width={isNonMobileScreens ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
            >
                <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
                    Welcome to RippleConnect, where the power of the Ripple brings people together. We're glad to have you here!
                </Typography>
                <Form />
            </Box>
        </Box>
    );
};

export default LoginPage;