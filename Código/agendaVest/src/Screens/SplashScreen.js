import { useNavigation } from "@react-navigation/native";
import { Dimensions, View } from "react-native";
import LottieView from "lottie-react-native";
const { width, height } = Dimensions.get("screen");

const SplashScreen = () => {
  const navigation = useNavigation();

  const animacacao = () => {
    navigation.navigate("InicioScreen");
  };

  return (
    <View>
      <LottieView
        source={require("./splash.json")}
        style={{ width: "100%", height: "100%" }}
        autoPlay
        loop={false}
        onAnimationFinish={animacacao}
      />
    </View>
  );
};
export default SplashScreen;
