import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Form from "./Form";

const ProfileEditPage = () => {
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 100px)");

    const { _id } = useSelector((state) => state.user);

    return <Box>
        <Box width="100%" backgroundColor={theme.palette.background.alt} p="1rem 6%" textAlign="center">
            <Typography
                fontWeight="bold"
                fontSize="32px"
                color="blue">
                ConnectVerse
            </Typography>
        </Box>
        <Box width={isNonMobileScreens ? "50%" : "93%"}
            p="2rem"
            m="2rem auto"
            borderRadius="1.5rem"
            backgroundColor={theme.palette.background.alt}
        >
            <Typography fontWeight="500" variant="h3" sx={{ mb: "1.5rem" }}>
                Edit Profile
            </Typography>
            <Form userId={_id} />
            

        </Box>
    </Box>;
}

export default ProfileEditPage;