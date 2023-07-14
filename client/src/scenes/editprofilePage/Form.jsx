import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ContentPasteOffOutlined } from "@mui/icons-material";




const Form = ({ userId }) => {

    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const token = useSelector((state) => state.token);
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
    const [user, setUser] = useState(null);

    const getUser = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
    };

    useEffect(() => {
        getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) {
        return null;
    }

    const {
        firstName,
        lastName,
        location,
        occupation,
        twitterId,
        linkedinId,
        instagramId
    } = user;

    const initialValuesRegister = {
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        occupation: user.occupation,
        twitterId: user.twitterId,
        linkedinId: user.linkedinId,
        instagramId: user.instagramId,
    };

    const EditProfile = async (values, onSubmitProps) => {
        try {

            const savedUserResponse = await fetch(`http://localhost:3001/users/${userId}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(values)
            });

            if (!savedUserResponse.ok) {
                throw new Error("Failed to update profile");
            }

            const savedUser = await savedUserResponse.json();
            onSubmitProps.resetForm();
            navigate("/home");
        } catch (error) {
            console.error(error.message);
            // Handle the error appropriately (e.g., show an error message)
        }
    };




    const handleFormSubmit = async (values, onSubmitProps) => {
        await EditProfile(values, onSubmitProps);
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValuesRegister}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                        }}
                    >

                        <TextField
                            label="First Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                            name="firstName"
                            error={
                                Boolean(touched.firstName) && Boolean(errors.firstName)
                            }
                            helperText={touched.firstName && errors.firstName}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                            label="Last Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                            name="lastName"
                            error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                            label="Location"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.location}
                            name="location"
                            error={Boolean(touched.location) && Boolean(errors.location)}
                            helperText={touched.location && errors.location}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Occupation/Bio"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.occupation}
                            name="occupation"
                            error={
                                Boolean(touched.occupation) && Boolean(errors.occupation)
                            }
                            helperText={touched.occupation && errors.occupation}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
                            Other Social Profiles
                        </Typography>
                        <TextField
                            label="Twitter Handle"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.twitterId}
                            name="twitterId"
                            error={
                                Boolean(touched.occupation) && Boolean(errors.occupation)
                            }
                            helperText={touched.occupation && errors.occupation}
                            sx={{ gridColumn: "span 4" }}
                        />

                        <TextField
                            label="Linkedin Profile URL"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.linkedinId}
                            name="linkedinId"
                            error={
                                Boolean(touched.occupation) && Boolean(errors.occupation)
                            }
                            helperText={touched.occupation && errors.occupation}
                            sx={{ gridColumn: "span 4" }}
                        />

                        <TextField
                            label="Instagram Handle"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.instagramId}
                            name="instagramId"
                            error={
                                Boolean(touched.occupation) && Boolean(errors.occupation)
                            }
                            helperText={touched.occupation && errors.occupation}
                            sx={{ gridColumn: "span 4" }}
                        />

                        {/* <Box
                            gridColumn="span 4"
                            border={`1px solid ${palette.neutral.medium}`}
                            borderRadius="5px"
                            p="1rem"
                        >
                            <Dropzone
                                acceptedFiles=".jpg,.jpeg,.png"
                                multiple={false}
                                onDrop={(acceptedFiles) =>
                                    setFieldValue("picturePath", acceptedFiles[0])
                                }
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <Box
                                        {...getRootProps()}
                                        border={`2px dashed ${palette.primary.main}`}
                                        p="1rem"
                                        sx={{ "&:hover": { cursor: "pointer" } }}
                                    >
                                        <input {...getInputProps()} />
                                        {!values.picturePath ? (
                                            <p>Add Picture Here</p>
                                        ) : (
                                            <FlexBetween>
                                                <p>{values.picturePath}</p>
                                                <Typography>{values.picturePath.name}</Typography>
                                                <EditOutlinedIcon />
                                            </FlexBetween>
                                        )}
                                    </Box>
                                )}
                            </Dropzone>
                        </Box> */}

                    </Box>

                    {/* BUTTONS */}
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "2rem 0",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main },
                            }}
                        >
                            {"UPDATE"}
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default Form;