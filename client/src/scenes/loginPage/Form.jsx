import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme
} from "@mui/material";
import EditOutinedIcon from "@mui/icons-material/EditOutlined";
// forms library
import { Formik } from "formik";
// validation library
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
// to let user uplaod image we need below package
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { PaletteRounded } from "@mui/icons-material";

// yup validation schema, it will determine the shape of how
// the form library is going to be saving the info
// it will check that users don't put some symbols or numbers for all fields
// and validate email address and make sure all fields are filled
const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("Invalid Email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid Email").required("required"),
    password: yup.string().required("required"),
});

// below one sets up the initial values for register & login
const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
};

const initialValuesLogin = {
    email: "",
    password: "",
};

const Form = () => {
    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const isLogin = pageType === "login"; //sets isLogin to true if state is "login"
    const isRegister = pageType === "register"; //sets isRegister to true if state is "register"

    const register = async (values, onSubmitProps) => {
        // normally I would extract user entered data from body of request
        // but since this handles image input as well so I use below JS API
        // so below line basically allows me to send form info with image
        const formData = new FormData();
        // below loop will cycle through all key value pairs and
        // add it to formData
        for (let value in values) {
            formData.append(value, values[value])
        }
        formData.append('picturePath', values.picture.name);

        // saving whatever is returned from the backend
        // I am sending the formData to the below API Call
        const savedUserResponse = await fetch(
            "http://localhost:3001/auth/register",
            {
                method: "POST",
                body: formData
            }
        );
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        // if user registered successfully take them to login page
        if(savedUser) {
            setPageType("login");
        }
    }

    const login = async (values, onSubmitProps) => {
        const loggedInUserResponse = await fetch(
            "http://localhost:3001/auth/login",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(values)
            }
        );
        const loggedIn = await loggedInUserResponse.json();
        onSubmitProps.resetForm();

        if(loggedIn) {
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token
                })
            );
            navigate("/home");
        }
        
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        if(isLogin) await login(values, onSubmitProps);
        if(isRegister) await register(values, onSubmitProps);
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
        >
        {/* what Formik is doing is that onSubmit it calls our handleFormSubmit
        then passes it to below anonymous function as handleSubmit
        which we can use inside the html form tag event: onSubmit 
        after which I can do all normal html form stuff*/}
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm
            }) => (
                
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            /* if app is on mobile screen then all fields will take entire
                            screen for them as a span of 4 */
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4"},
                        }}
                    >
                        {isRegister && (
                            <>
                                <TextField 
                                    label="First Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="firstName"
                                    /* below one will show if firstName has been touched or is it having
                                    any errors, if they are true then error will be shown for this
                                    particular field */
                                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                    // if firstName is touched and also has errors then we show error
                                    // but if it is only touched then we show that it was touched
                                    helperText={touched.firstName && errors.firstName}
                                    // below property will be overridden by span 4 in smaller screens
                                    sx={{ gridColumn: "span 2"}}
                                />
                                <TextField 
                                    label="Last Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName"
                                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={{ gridColumn: "span 2"}}
                                />
                                <TextField 
                                    label="Location"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name="location"
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                    helperText={touched.location && errors.location}
                                    sx={{ gridColumn: "span 4"}}
                                />
                                <TextField 
                                    label="Occupation"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.occupation}
                                    name="occupation"
                                    error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                                    helperText={touched.occupation && errors.occupation}
                                    sx={{ gridColumn: "span 4"}}
                                />
                                <Box
                                    gridColumn="span 4"
                                    border={`1px solid ${palette.neutral.medium}`}
                                    borderRadius="5px"
                                    p="1rem"
                                >
                                    <Dropzone
                                        // can upload only these formats
                                        acceptedFiles=".jpeg,.jpg,.png"
                                        // accepts only 1 upload
                                        multiple={false}
                                        onDrop={(acceptedFiles) => 
                                        // since there are readymade `TextField` components
                                        // I need to manually set value of form field below
                                            setFieldValue("picture", acceptedFiles[0])
                                        }
                                    >
                                    {/* getting hold of props and passing them to the `Box` jsx
                                    inside the anonymous function */}
                                        {({ getRootProps, getInputProps }) => (
                                            <Box
                                                {...getRootProps()}
                                                border={`2px dashed ${palette.primary.main}`}
                                                p="1rem"
                                                sx={{ "&:hover": {cursor: "pointer"} }}
                                            >
                                                <input {...getInputProps()} />
                                                {/* if values for pictures doesn't exist
                                                I will display Add Picture Here message in
                                                input box otherwise show name of picture*/}
                                                {!values.picture ? (
                                                    <p>Add Picture Here</p>
                                                ) : (
                                                    <FlexBetween>
                                                        <Typography>
                                                            {values.picture.name}
                                                        </Typography>
                                                        <EditOutinedIcon />
                                                    </FlexBetween>  
                                                )}
                                            </Box>
                                        )}
                                    </Dropzone>
                                </Box>
                            </>
                        )}
                        {/* This below fields will be both for register & login 
                        i.e email & password */}
                        <TextField 
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4"}}
                        />
                        <TextField 
                            type="password"
                            label="Password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 4"}}
                        />
                    </Box>

                    {/* BUTTONS */}
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m:"2rem 0",
                                p:"1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main}
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTER"}
                        </Button>
                        <Typography
                            onClick={() => {
                                setPageType(isLogin ? "register" : "login");
                                resetForm();
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.light
                                }
                            }}
                        >
                            {isLogin 
                                ? "Don't have an account? Sign Up here." 
                                : "Already have an account? Login here."}
                        </Typography>
                    </Box>
                </form>
                /* the `gridTemplatecolums="repeat(4, minmax(0, 1fr))"`
                means that It's gonna split the grid into 4 sections
                it will be min 0 if screen is small otherwise in equal
                fractions of 4
                
                "& > div" is targetting any div of <Box></Box> as a child
                component*/
            )}
        </Formik>
    );
}

export default Form;