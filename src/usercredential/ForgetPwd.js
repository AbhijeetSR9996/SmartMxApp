import React, { useEffect } from "react";
import {
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import axios from "axios";

import { icons, images } from "../../constant";
import Greeting from "../../reusablecomponent/Greeting";
import InputField from "../../reusablecomponent/InputField";
import TextButton from "../../reusablecomponent/TextButton";

const ForgetPwd = ({ navigation }) => {
  const [phone, setPhone] = React.useState("");
  const [apiData, setApiData] = React.useState([]);

  const handlePhoneChange = (text) => {
    setPhone(text);
  };

  useEffect(() => {
    // Code inside the useEffect hook
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://smart.techpanda.art/register/"
        );
        const responseData = response.data;
        setApiData(responseData);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchData();
  }, []);

  const handleForgotPassword = () => {
    const matchingData = apiData.find((item) => item.phone_no === phone);
    if (matchingData) {
      console.log("Matching Data:", matchingData);
      navigation.navigate("OtpScreen", { data: matchingData });
    }
  };

  console.log("API Data:", apiData);

  // Rest of the component code...

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={images.homeBg}
        style={{
          widht: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      >
        <View style={{marginHorizontal: 20, marginTop: 25,marginBottom:-20}}>

          <Text   style={{
          fontFamily: "Poppins-Bold",
          fontSize: 25,
          fontWeight: 800,
          lineHeight: 38,
          letterSpacing: 0.05,
          color: "#FFFFFF",
          alignSelf: 'flex-start',
        }}>Oh, no! I forgot
        </Text>

          <Text  style={{
          fontFamily: "Poppins-Regular",
          fontSize: 14,
          fontWeight: 400,
          lineHeight: 21,
          letterSpacing: 0.05,
          color: "#FFFFFF",
          opacity: 0.75,
          marginBottom: '8.5%',
        }}>Enter your phone or username, and we will send you a link to change your password</Text>


        {/* <Greeting
          greeting={"Oh, no! I forgot"}
          contend={
            "Enter your phone or username, and we will send you a link to change your password"
          }
        /> */}
        </View>



        <ScrollView>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: "25%",
            }}
          >
            <Image
              source={icons.homeIcon}
              style={{
                width: 106,
                height: 106,
              }}
            />
          </View>

          <View style={{ marginHorizontal: 20, marginTop: "15%" }}>
            <InputField
              placeholder="Username or Phone Number"
              icon={icons.user}
              title="Phone"
              value={phone}
              maxLength={10}
              onChange={handlePhoneChange}
            />

            <View style={{ marginTop: 40 }}>
              <TextButton
                title={"Forgot Password"}
                bgColor={"#6D21A9"}
                color={"#ffffff"}
                onPress={handleForgotPassword}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginTop: 90,
              marginBottom: 50,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontWeight: "500",
                fontSize: 12,
                lineHeight: 18,
                color: "#000000",
                marginTop: 1,
              }}
            >
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text
                style={{
                  marginLeft: 5,
                  fontFamily: "Poppins-Bold",
                  fontWeight: "700",
                  fontSize: 12,
                  lineHeight: 18,
                  color: "#6D21A9",
                  letterSpacing: 0.05,
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ForgetPwd;
