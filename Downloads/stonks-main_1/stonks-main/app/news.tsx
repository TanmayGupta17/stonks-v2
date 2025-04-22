import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Animated,
  ToastAndroid,
  Platform,
  Dimensions,
  PanResponder,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NewsPredictionItem {
  stockTicker: string;
  newsHeadline: string;
  newsDetails: string;
  isBullish: boolean;
  explanation: string;
}

const BullishBearishGame = () => {
  const [newsList, setNewsList] = useState<NewsPredictionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const position = useRef(new Animated.ValueXY()).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const swipeThreshold = 120;

  useEffect(() => {
    initNewsList();
    loadHighScore();
  }, []);

  useEffect(() => {
    if (currentIndex < newsList.length) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [currentIndex]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => !isAnimating,
    onPanResponderMove: (_, gestureState) => {
      if (!isAnimating) {
        position.setValue({ x: gestureState.dx, y: 0 });
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (isAnimating) return;

      if (gestureState.dx > swipeThreshold) {
        swipeCard(true);
      } else if (gestureState.dx < -swipeThreshold) {
        swipeCard(false);
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const initNewsList = () => {
    const list: NewsPredictionItem[] = [
      {
        stockTicker: "RELIANCE",
        newsHeadline:
          "Reliance Industries launches new green energy initiative",
        newsDetails:
          "Reliance Industries announced a ₹75,000 crore investment in green energy initiatives including solar manufacturing and hydrogen production. The company aims to become carbon neutral by 2035.",
        isBullish: true,
        explanation:
          "This is BULLISH because substantial investment in future-focused green energy positions the company for long-term growth and aligns with global sustainability trends, potentially opening new revenue streams.",
      },
      {
        stockTicker: "INFY",
        newsHeadline:
          "Infosys reports weak quarterly results, cuts revenue guidance",
        newsDetails:
          "IT giant Infosys reported Q2 revenues below market expectations and reduced its FY24 revenue growth guidance from 5-7% to 3-5%, citing delayed project ramp-ups and cautious client spending in uncertain macroeconomic conditions.",
        isBullish: false,
        explanation:
          "This is BEARISH because lower-than-expected quarterly results and reduced guidance indicates business challenges ahead. Clients reducing IT spending signals potential revenue pressure in upcoming quarters.",
      },
      {
        stockTicker: "TATAMOTORS",
        newsHeadline:
          "Tata Motors' JLR reports record order book and improved chip supply",
        newsDetails:
          "Jaguar Land Rover, owned by Tata Motors, announced its highest-ever order book of over 205,000 units as semiconductor supply constraints continue to ease. JLR's revenue increased 42% year-on-year.",
        isBullish: true,
        explanation:
          "This is BULLISH because resolution of supply chain issues combined with strong demand (record order book) signals improved production capabilities and higher future revenues.",
      },
      {
        stockTicker: "AXISBANK",
        newsHeadline:
          "Axis Bank faces RBI penalty for regulatory non-compliance",
        newsDetails:
          "The Reserve Bank of India imposed a ₹97 lakh penalty on Axis Bank for non-compliance with certain provisions related to loans and advances. The bank stated the penalty would not materially impact its operations.",
        isBullish: false,
        explanation:
          "This is BEARISH because regulatory penalties indicate compliance issues which could lead to increased scrutiny, potential operational changes, and reputational damage.",
      },
      {
        stockTicker: "ADANIPORTS",
        newsHeadline: "Adani Ports acquires strategic stake in Gopalpur Port",
        newsDetails:
          "Adani Ports and Special Economic Zone Ltd (APSEZ) announced acquisition of a 95% stake in Gopalpur Port in Odisha for ₹3,350 crore, furthering its strategy to expand along India's eastern coastline.",
        isBullish: true,
        explanation:
          "This is BULLISH because strategic acquisitions expand the company's operational footprint, potentially creating new revenue streams and strengthening market position.",
      },
      {
        stockTicker: "HDFCBANK",
        newsHeadline: "HDFC Bank experiences digital services outage",
        newsDetails:
          "HDFC Bank customers reported widespread issues accessing net banking and mobile app services for over 5 hours. The bank attributed the outage to technical issues during a system upgrade and apologized for the inconvenience.",
        isBullish: false,
        explanation:
          "This is BEARISH because service disruptions raise concerns about operational resilience and can lead to customer dissatisfaction, potential regulatory scrutiny, and reputational damage.",
      },
      {
        stockTicker: "TCS",
        newsHeadline:
          "TCS wins multi-year digital transformation deal with leading global airline",
        newsDetails:
          "Tata Consultancy Services secured a multi-year, multi-million dollar contract to lead the digital transformation for one of the world's largest airlines, focusing on cloud migration and AI-powered customer experience enhancements.",
        isBullish: true,
        explanation:
          "This is BULLISH because large, long-term contracts provide revenue visibility and demonstrate the company's competitive strength in winning significant international business.",
      },
      {
        stockTicker: "BHARTIARTL",
        newsHeadline:
          "Bharti Airtel announces significant tariff hikes across all plans",
        newsDetails:
          "Telecom major Bharti Airtel announced 15-25% price increases across all prepaid and postpaid plans effective next month, citing the need to improve average revenue per user (ARPU) for sustainable operations.",
        isBullish: true,
        explanation:
          "This is BULLISH because tariff increases directly improve revenue and profitability metrics without significant additional costs, assuming limited customer churn.",
      },
      {
        stockTicker: "ZOMATO",
        newsHeadline:
          "Zomato reports widening quarterly losses despite revenue growth",
        newsDetails:
          "Food delivery platform Zomato reported a 69% increase in quarterly losses despite 17% revenue growth. The company continues to invest heavily in quick commerce and loyalty programs to counter increasing competition.",
        isBullish: false,
        explanation:
          "This is BEARISH because widening losses despite revenue growth indicate deteriorating unit economics or ineffective scaling strategies, raising concerns about the path to profitability.",
      },
      {
        stockTicker: "BAJFINANCE",
        newsHeadline: "Bajaj Finance announces share buyback program",
        newsDetails:
          "Bajaj Finance's board approved a share buyback program worth ₹4,000 crore at ₹7,250 per share, representing a 15% premium to the current market price. The company cited strong capital position and confidence in business outlook.",
        isBullish: true,
        explanation:
          "This is BULLISH because buybacks reduce share count (improving EPS), signal management's confidence in company prospects, and provide price support for the stock.",
      },
      {
        stockTicker: "SUNPHARMA",
        newsHeadline:
          "Sun Pharma recalls multiple batches of diabetes medication in US",
        newsDetails:
          "Sun Pharmaceutical Industries is recalling several batches of a diabetes medication from the US market after FDA inspections found manufacturing deficiencies at its Gujarat facility. The company faces potential supply disruptions.",
        isBullish: false,
        explanation:
          "This is BEARISH because product recalls impact revenue, increase costs (recall expenses), and can damage relationships with regulators and customers while raising questions about quality control.",
      },
      {
        stockTicker: "HCLTECH",
        newsHeadline:
          "HCL Technologies raises full-year guidance after strong quarterly performance",
        newsDetails:
          "HCL Technologies raised its FY24 revenue growth guidance from 5-7% to 6-8% after reporting Q3 results that exceeded analyst expectations, citing strong demand in digital, cloud and AI services.",
        isBullish: true,
        explanation:
          "This is BULLISH because increased guidance reflects management's growing confidence in future performance, suggesting stronger-than-anticipated business momentum.",
      },
      {
        stockTicker: "WIPRO",
        newsHeadline:
          "Wipro announces major leadership reshuffle amid underperformance",
        newsDetails:
          "IT services provider Wipro announced a significant reorganization of its leadership team after reporting consecutive quarters of industry-lagging growth. Several key executives are departing as the company attempts to revitalize performance.",
        isBullish: false,
        explanation:
          "This is BEARISH because leadership instability creates uncertainty about strategic direction and execution capabilities, while acknowledging the company's underperformance.",
      },
      {
        stockTicker: "TATASTEEL",
        newsHeadline: "Tata Steel secures green funding for expansion project",
        newsDetails:
          "Tata Steel successfully raised ₹8,500 crore through green bonds to fund its environmentally sustainable capacity expansion at Kalinganagar. The bond issue was oversubscribed 3 times, reflecting strong investor confidence.",
        isBullish: true,
        explanation:
          "This is BULLISH because successful fundraising enables growth projects while strong demand for the offering signals investor confidence. Green initiatives can also improve long-term competitive positioning.",
      },
    ];
    setNewsList(list);
  };

  const loadHighScore = async () => {
    try {
      const value = await AsyncStorage.getItem("BULLISH_BEARISH_HIGH_SCORE");
      if (value !== null) {
        setHighScore(parseInt(value));
      }
    } catch (error) {
      console.error("Error loading high score", error);
    }
  };

  const saveHighScore = async (newHighScore: number) => {
    try {
      await AsyncStorage.setItem(
        "BULLISH_BEARISH_HIGH_SCORE",
        newHighScore.toString()
      );
    } catch (error) {
      console.error("Error saving high score", error);
    }
  };

  const loadNextNews = () => {
    fadeAnim.setValue(0);
    setShowExplanation(false);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // On iOS we could implement a custom toast
      Alert.alert(message);
    }
  };

  const triggerBounce = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const swipeCard = (userChoice: boolean) => {
    setIsAnimating(true);
    const currentNews = newsList[currentIndex];
    const isCorrect = userChoice === currentNews.isBullish;

    // Animate card off screen
    Animated.timing(position, {
      toValue: { 
        x: userChoice ? Dimensions.get('window').width : -Dimensions.get('window').width,
        y: 0 
      },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Update score and show explanation
      if (isCorrect) {
        setScore(score + 1);
        triggerBounce();
      }
      setShowExplanation(true);

      // Wait for explanation to be shown
      setTimeout(() => {
        // Reset position and move to next card
        position.setValue({ x: 0, y: 0 });
        setCurrentIndex(currentIndex + 1);
        setShowExplanation(false);
        setIsAnimating(false);

        // Check if game is over
        if (currentIndex + 1 >= newsList.length) {
          showFinalDialog();
        }
      }, 2000);
    });
  };

  const showFinalDialog = () => {
    const newHighScore = score > highScore ? score : highScore;

    if (newHighScore > highScore) {
      setHighScore(newHighScore);
      saveHighScore(newHighScore);
    }

    Alert.alert(
      "Game Over",
      `Your Score: ${score}\nHigh Score: ${newHighScore}`,
      [
        {
          text: "Play Again",
          onPress: resetGame,
          style: "default",
        },
        {
          text: "Exit",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowExplanation(false);
    loadNextNews();
  };

  // Rotate and opacity based on position
  const rotate = position.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: ["10deg", "0deg", "-10deg"],
  });

  const leftOpacity = position.x.interpolate({
    inputRange: [-200, -100, 0],
    outputRange: [1, 0.5, 0],
  });

  const rightOpacity = position.x.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, 0.5, 1],
  });

  // Show current news item if available
  const currentItem =
    currentIndex < newsList.length ? newsList[currentIndex] : null;

  if (!currentItem) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bullish / Bearish</Text>

      <View style={styles.gameContainer}>
        <Text style={styles.instructionText}>
          Swipe RIGHT for BULLISH, LEFT for BEARISH
        </Text>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { scale: bounceAnim }
              ]
            }
          ]}
          {...panResponder.panHandlers}
        >
          {/* Swipe indicators */}
          <Animated.View
            style={[
              styles.swipeIndicator,
              styles.leftIndicator,
              { opacity: leftOpacity },
            ]}
          >
            <Text style={styles.swipeIndicatorText}>BEARISH</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.swipeIndicator,
              styles.rightIndicator,
              { opacity: rightOpacity },
            ]}
          >
            <Text style={styles.swipeIndicatorText}>BULLISH</Text>
          </Animated.View>

          <Text style={styles.stockName}>{currentItem.stockTicker}</Text>
          <Animated.Text
            style={[
              styles.newsHeadline,
              { transform: [{ scale: bounceAnim }] },
            ]}
          >
            {currentItem.newsHeadline}
          </Animated.Text>
          <Text style={styles.newsDetails}>{currentItem.newsDetails}</Text>

          {showExplanation && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationTitle}>EXPLANATION:</Text>
              <Text style={styles.explanationText}>
                {currentItem.explanation}
              </Text>
            </View>
          )}
        </Animated.View>

        <View style={styles.statsContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.scoreText}>Best: {highScore}</Text>
          <Text style={styles.progressText}>
            {currentIndex + 1}/{newsList.length}
          </Text>
        </View>

        <View style={styles.swipeHelpContainer}>
          <View style={styles.swipeHelpItem}>
            <Text style={[styles.swipeHelpText, { color: "#ff4757" }]}>
              ← BEARISH
            </Text>
          </View>
          <View style={styles.swipeHelpItem}>
            <Text style={[styles.swipeHelpText, { color: "#2ed573" }]}>
              BULLISH →
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#121212",
    paddingTop: 50,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00ff9d",
    marginBottom: 20,
  },
  gameContainer: {
    width: "90%",
    alignItems: "center",
  },
  instructionText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
  },
  card: {
    width: "100%",
    backgroundColor: "#1e272e",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: "relative",
    minHeight: 300,
  },
  stockName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#00ff9d",
  },
  newsHeadline: {
    fontSize: 22,
    marginBottom: 10,
    color: "#fff",
    lineHeight: 30,
    fontWeight: "bold",
  },
  newsDetails: {
    fontSize: 16,
    marginBottom: 15,
    color: "#ddd",
    lineHeight: 22,
  },
  explanationContainer: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00ff9d",
    marginBottom: 5,
  },
  explanationText: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00ff9d",
  },
  swipeIndicator: {
    position: "absolute",
    top: "40%",
    padding: 10,
    borderRadius: 10,
    zIndex: 999,
  },
  leftIndicator: {
    left: 10,
    backgroundColor: "rgba(255, 71, 87, 0.8)",
    transform: [{ rotate: "-10deg" }],
  },
  rightIndicator: {
    right: 10,
    backgroundColor: "rgba(46, 213, 115, 0.8)",
    transform: [{ rotate: "10deg" }],
  },
  swipeIndicatorText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  swipeHelpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  swipeHelpItem: {
    padding: 10,
    alignItems: "center",
    width: "50%",
  },
  swipeHelpText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BullishBearishGame;
