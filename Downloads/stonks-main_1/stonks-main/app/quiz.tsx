import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

export default function StockQuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = [
    {
      question: "What does 'Bull Market' represent?",
      options: [
        "A market condition where prices are falling",
        "A market condition where prices are rising",
        "A market with high volatility",
        "A market with no trading activity",
      ],
      correctAnswer: 1,
      explanation:
        "A Bull Market represents a market condition where stock prices are rising or expected to rise.",
    },
    {
      question: "What is a 'Blue Chip' stock?",
      options: [
        "A high-risk, high-reward stock",
        "A stock from technology companies",
        "A well-established company with stable earnings",
        "A recently listed company",
      ],
      correctAnswer: 2,
      explanation:
        "Blue Chip stocks are from well-established companies known for their reliability, quality, and ability to operate profitably in good and bad times.",
    },
    {
      question: "What does 'P/E Ratio' stand for in stock valuation?",
      options: [
        "Profit/Earnings Ratio",
        "Price/Earnings Ratio",
        "Potential/Equity Ratio",
        "Performance/Efficiency Ratio",
      ],
      correctAnswer: 1,
      explanation:
        "P/E Ratio stands for Price-to-Earnings Ratio, a valuation ratio of a company's current share price compared to its per-share earnings.",
    },
    {
      question: "What is a 'Market Order'?",
      options: [
        "An order to buy or sell a stock at the best available current price",
        "An order to buy or sell a stock when it reaches a specific price",
        "An order that must be executed at the closing of the market",
        "An order valid for a specific time period",
      ],
      correctAnswer: 0,
      explanation:
        "A Market Order is an instruction to buy or sell a stock immediately at the best available current price.",
    },
    {
      question: "What does 'IPO' stand for?",
      options: [
        "International Portfolio Optimization",
        "Investment Protection Option",
        "Initial Public Offering",
        "Integrated Profit Outlook",
      ],
      correctAnswer: 2,
      explanation:
        "IPO stands for Initial Public Offering - the process when a private company offers shares to the public for the first time.",
    },
  ];

  const handleAnswer = (optionIndex: any) => {
    setSelectedOption(optionIndex);
    setShowAnswer(true);

    if (optionIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowAnswer(false);
        setSelectedOption(null);
      } else {
        setIsCompleted(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowAnswer(false);
    setSelectedOption(null);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={["#0a2e38", "#000000"]}
          style={styles.completedContainer}
        >
          <View style={styles.completedContent}>
            <FontAwesome5 name="trophy" size={60} color="#58cc02" />
            <Text style={styles.completedTitle}>Quiz Completed!</Text>
            <Text style={styles.scoreText}>
              Your Score: {score}/{questions.length}
            </Text>
            <Text style={styles.completedMessage}>
              {score === questions.length
                ? "Perfect! You're a stock market genius!"
                : score >= questions.length / 2
                ? "Good job! Keep learning to become a stock market expert."
                : "Keep practicing to improve your stock market knowledge."}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={resetQuiz}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.progressBarContainer}>
          {questions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                {
                  backgroundColor:
                    index < currentQuestionIndex
                      ? "#58cc02"
                      : index === currentQuestionIndex
                      ? "#78d549"
                      : "#1b4b5a",
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.scoreContainer}>
          <FontAwesome5 name="heart" size={16} color="#ff4b4b" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === index &&
                showAnswer &&
                (index === currentQuestion.correctAnswer
                  ? styles.correctOption
                  : styles.incorrectOption),
            ]}
            onPress={() => !showAnswer && handleAnswer(index)}
            disabled={showAnswer}
          >
            <Text style={styles.optionText}>{option}</Text>
            {showAnswer && index === currentQuestion.correctAnswer && (
              <FontAwesome5
                name="check"
                size={18}
                color="#fff"
                style={styles.optionIcon}
              />
            )}
            {showAnswer &&
              selectedOption === index &&
              index !== currentQuestion.correctAnswer && (
                <FontAwesome5
                  name="times"
                  size={18}
                  color="#fff"
                  style={styles.optionIcon}
                />
              )}
          </TouchableOpacity>
        ))}

        {showAnswer && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationText}>
              {selectedOption === currentQuestion.correctAnswer
                ? "Correct! "
                : "Incorrect. "}
              {currentQuestion.explanation}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c2b36",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "#0a1f27",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBarContainer: {
    flexDirection: "row",
    flex: 1,
    marginRight: 10,
  },
  progressSegment: {
    flex: 1,
    height: 8,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: "center",
  },
  questionText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#204e58",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2c6b7b",
  },
  correctOption: {
    backgroundColor: "#58cc02",
    borderColor: "#58cc02",
  },
  incorrectOption: {
    backgroundColor: "#ea2b2b",
    borderColor: "#ea2b2b",
  },
  optionText: {
    color: "white",
    fontSize: 16,
    flex: 1,
  },
  optionIcon: {
    marginLeft: 10,
  },
  explanationContainer: {
    padding: 16,
    backgroundColor: "#1a3540",
    borderRadius: 12,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#58cc02",
  },
  explanationText: {
    color: "white",
    fontSize: 14,
  },
  completedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  completedContent: {
    alignItems: "center",
    backgroundColor: "#0c2b36",
    padding: 30,
    borderRadius: 20,
    width: "100%",
    maxWidth: 350,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    marginBottom: 10,
  },
  completedMessage: {
    fontSize: 16,
    color: "#b2c8ce",
    textAlign: "center",
    marginVertical: 20,
  },
  retryButton: {
    backgroundColor: "#58cc02",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
