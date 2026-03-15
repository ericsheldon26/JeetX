import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image as RNImage, ScrollView } from "react-native";
import { CONFIG, getAccessToken } from "../../api/config";
import { useIsFocused } from '@react-navigation/native';

const Image = (props: any) => <View {...props} style={[{ backgroundColor: 'rgba(255,255,255,0.1)' }, props.style]} ><RNImage {...props} style={{ display: 'none' }} /></View>;
import LinearGradient from "react-native-linear-gradient";
// import { SafeAreaView } from "react-native-safe-area-context"; // Original Windows/Native code
import ScreenWrapper from "../../components/ScreenWrapper"; // Linux/NewArch Fix


const WalletNowScreen = () => {
    const isFocused = useIsFocused();
    const [coinBalance, setCoinBalance] = useState(0);

    useEffect(() => {
        if (isFocused) {
            fetchWalletData();
        }
    }, [isFocused]);

    const fetchWalletData = async () => {
        try {
            const token = getAccessToken();
            if (!token) return;

            const response = await fetch(`${CONFIG.BASE_URL}api/v1/referral/wallet`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data && data.success && data.data) {
                setCoinBalance(data.data.coin_balance);
            }
        } catch (error) {
            console.error('Wallet Fetch Error:', error);
        }
    };

    return (
        <ScreenWrapper 
          style={styles.viewBg}
          statusBarColor="#010e0f"
          statusBarStyle="light-content"
          backgroundColor="#f4f6f6"
        >
            {/* <SafeAreaView style={styles.viewBg}> */} {/* Original code */}

            <View style={[styles.view, styles.viewLayout]}>

                <View style={[styles.mainBody, styles.mainBodyLayout]}>
                    <View style={styles.categories} />

                    <Text style={[styles.myTransactions, styles.text4Typo]}>My Transactions</Text>
                    <View style={[styles.mathQuiz, styles.mathBorder1]}>
                        <View style={[styles.mathQuizChild, styles.mathBorder]} />
                        <Text style={[styles.currentBalance, styles.text2Typo]}>Current Balance</Text>
                        <Text style={[styles.text, styles.textTypo]}>{coinBalance.toLocaleString()}</Text>
                        <View style={[styles.totalCoinsBoughtParent, styles.totalParentFlexBox]}>
                            <Text style={[styles.totalCoinsBought, styles.coinsTypo]}>Total Coins Bought</Text>
                            <Text style={styles.text2Typo}>7,800</Text>
                        </View>
                        <View style={[styles.totalCoinsEarnedParent, styles.totalParentFlexBox]}>
                            <Text style={[styles.totalCoinsBought, styles.coinsTypo]}>Total Coins Earned</Text>
                            <Text style={styles.text2Typo}>1,250</Text>
                        </View>
                        <Image style={[styles.arrowUpRightUndefinedG, styles.arrowLayout]} resizeMode="cover" />
                        <View style={[styles.rectangleParent, styles.frameChildLayout]}>
                            <View style={[styles.frameChild, styles.frameChildLayout]} />
                            <View style={styles.frameChildPosition1} />
                            <View style={styles.frameChildPosition} />
                            <Text style={[styles.getIn, styles.getInTypo]}>Get IN</Text>
                        </View>
                        <Image style={styles.chatgptImageOct2202511} resizeMode="cover" />
                        <LinearGradient style={[styles.addCoinsWrapper, styles.addCoinsWrapperLayout]} locations={[0, 1]} colors={['#ff8b26', '#ef3c00']} useAngle={true} angle={186.36}>
                            <Text style={[styles.addCoins, styles.textTypo]}>Add Coins</Text>
                        </LinearGradient>
                    </View>
                    <Text style={styles.keepEarningCoins}>Keep Earning Coins For Better Prizes</Text>
                    <Image style={styles.chevronDownUndefinedGly} resizeMode="cover" />
                    <View style={[styles.mathQuizParent, styles.mathBorder1]}>
                        <View style={[styles.mathQuiz2, styles.mathLayout]}>
                            <View style={[styles.mathQuizItem, styles.mathBorder]} />
                            <View style={[styles.mathQuizInner, styles.mathLayout1]} />
                            <Text style={[styles.coins, styles.coinsTypo]}>65 Coins</Text>
                            <View style={[styles.chatgptImageJul13202503Wrapper, styles.xInnerPosition]}>
                                <View style={[styles.chatgptImageJul13202503, styles.chatgptLayout]} />
                            </View>
                            <View style={[styles.chatgptImageJul13202503Container, styles.chatgptPosition1]}>
                                <View style={[styles.chatgptImageJul132025032, styles.chatgptLayout]} />
                            </View>
                            <View style={[styles.chatgptImageJul13202503Frame, styles.chatgptPosition]}>
                                <View style={[styles.chatgptImageJul13202503, styles.chatgptLayout]} />
                            </View>
                            <Image style={[styles.arrowUpRightUndefinedG2, styles.arrowLayout]} resizeMode="cover" />
                            <View style={[styles.rectangleParent, styles.frameChildLayout]}>
                                <View style={[styles.frameChild, styles.frameChildLayout]} />
                                <View style={styles.frameChildPosition1} />
                                <View style={styles.frameChildPosition} />
                                <Text style={[styles.getIn, styles.getInTypo]}>Get IN</Text>
                            </View>
                            <View style={styles.lineView} />
                            <Image style={[styles.chatgptImageOct22025112, styles.addCoinsWrapperLayout]} resizeMode="cover" />
                            <Image style={styles.chatgptPosition1} resizeMode="cover" />
                            <Image style={[styles.chatgptImageOct22025114, styles.chatgptPosition]} resizeMode="cover" />
                            <Text style={[styles.text4, styles.text4Typo]}>₹ 11</Text>
                        </View>
                        <View style={[styles.mathQuiz3, styles.mathLayout]}>
                            <View style={[styles.mathQuizItem, styles.mathBorder]} />
                            <View style={[styles.mathQuizChild3, styles.mathLayout1]} />
                            <Text style={[styles.coins, styles.coinsTypo]}>Coins + Avatar + Dice</Text>
                            <View style={[styles.chatgptImageJul13202503Wrapper, styles.xInnerPosition]}>
                                <View style={[styles.chatgptImageJul13202503, styles.chatgptLayout]} />
                            </View>
                            <View style={[styles.chatgptImageJul13202503Container, styles.chatgptPosition1]}>
                                <View style={[styles.chatgptImageJul132025032, styles.chatgptLayout]} />
                            </View>
                            <View style={[styles.chatgptImageJul13202503Frame, styles.chatgptPosition]}>
                                <View style={[styles.chatgptImageJul13202503, styles.chatgptLayout]} />
                            </View>
                            <Image style={[styles.arrowUpRightUndefinedG2, styles.arrowLayout]} resizeMode="cover" />
                            <View style={[styles.rectangleParent, styles.frameChildLayout]}>
                                <View style={[styles.frameChild, styles.frameChildLayout]} />
                                <View style={styles.frameChildPosition1} />
                                <View style={styles.frameChildPosition} />
                                <Text style={[styles.getIn, styles.getInTypo]}>Get IN</Text>
                            </View>
                            <View style={styles.lineView} />
                            <Image style={[styles.chatgptImageOct22025112, styles.addCoinsWrapperLayout]} resizeMode="cover" />
                            <Image style={styles.chatgptPosition1} resizeMode="cover" />
                            <Image style={[styles.chatgptImageOct22025114, styles.chatgptPosition]} resizeMode="cover" />
                            <Text style={[styles.text4, styles.text4Typo]}>₹ 180</Text>
                        </View>
                        <View style={[styles.mathQuiz4, styles.mathLayout]}>
                            <View style={[styles.mathQuizItem, styles.mathBorder]} />
                            <View style={[styles.mathQuizInner, styles.mathLayout1]} />
                            <Text style={[styles.coins, styles.coinsTypo]}>Coins + Avatar + Dice</Text>
                            <View style={[styles.chatgptImageJul13202503Wrapper, styles.xInnerPosition]}>
                                <View style={[styles.chatgptImageJul13202503, styles.chatgptLayout]} />
                            </View>
                            <View style={[styles.chatgptImageJul13202503Container, styles.chatgptPosition1]}>
                                <View style={[styles.chatgptImageJul132025032, styles.chatgptLayout]} />
                            </View>
                            <View style={[styles.chatgptImageJul13202503Frame, styles.chatgptPosition]}>
                                <View style={[styles.chatgptImageJul13202503, styles.chatgptLayout]} />
                            </View>
                            <Image style={[styles.arrowUpRightUndefinedG2, styles.arrowLayout]} resizeMode="cover" />
                            <View style={[styles.rectangleParent, styles.frameChildLayout]}>
                                <View style={[styles.frameChild, styles.frameChildLayout]} />
                                <View style={styles.frameChildPosition1} />
                                <View style={styles.frameChildPosition} />
                                <Text style={[styles.getIn, styles.getInTypo]}>Get IN</Text>
                            </View>
                            <View style={styles.lineView} />
                            <Image style={[styles.chatgptImageOct22025112, styles.addCoinsWrapperLayout]} resizeMode="cover" />
                            <Image style={styles.chatgptPosition1} resizeMode="cover" />
                            <Image style={[styles.chatgptImageOct22025114, styles.chatgptPosition]} resizeMode="cover" />
                            <Text style={[styles.text4, styles.text4Typo]}>₹ 50</Text>
                        </View>
                    </View>
                    <Text style={[styles.viewAll, styles.coinsTypo]}>View All</Text>
                </View>
                <LinearGradient style={[styles.bg, styles.bgLayout]} locations={[0, 1]} colors={['#02121a', '#0d3648']} useAngle={true} angle={-90}>
                    <ScrollView style={styles.bgLayout} horizontal={true}>
                        <Image style={[styles.bgChild, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgItem, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgInner, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.groupIcon, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild2, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild3, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild4, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild5, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild6, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild7, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild8, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild9, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild10, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild11, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild12, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild13, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild14, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild15, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild16, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild17, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild18, styles.childLayout]} resizeMode="cover" />
                        <Text style={[styles.wallet, styles.textTypo]}>Wallet</Text>
                        <Image style={[styles.arrowUpUndefinedGlyph, styles.undefinedLayout]} resizeMode="cover" />
                        <View style={[styles.walletUndefinedGlyphUnParent, styles.undefinedLayout]}>
                            <Image style={[styles.walletUndefinedGlyphUn, styles.undefinedLayout]} resizeMode="cover" />
                            <Text style={[styles.text7, styles.getInTypo]}>₹{coinBalance.toLocaleString()}</Text>
                        </View>
                        <View style={styles.rectangleParent2}>
                            <View style={[styles.groupChild, styles.groupLayout]} />
                            <View style={[styles.groupItem, styles.groupLayout]} />
                            <View style={[styles.groupInner, styles.groupLayout]} />
                        </View>
                    </ScrollView>
                </LinearGradient>
            </View>
            {/* </SafeAreaView> */} {/* Original code */}
        </ScreenWrapper>
    );
};



const styles = StyleSheet.create({
    walletNowScreen: {
        flex: 1,
        backgroundColor: "#f4f6f6"
    },
    viewLayout: {
        overflow: "hidden",
        width: "100%"
    },
    mainBodyLayout: {
        width: 393,
        position: "absolute"
    },
    leftSideLayout: {
        height: 21,
        width: 54,
        left: "50%",
        position: "absolute"
    },
    rightSidePosition: {
        height: 13,
        left: "50%",
        position: "absolute"
    },
    iconPosition: {
        height: 12,
        top: 1,
        left: "50%",
        position: "absolute"
    },
    mathLayout1: {
        height: 68,
        position: "absolute"
    },
    eventsLayout: {
        width: 76,
        height: 68,
        backgroundColor: "#fff",
        position: "absolute",
        overflow: "hidden"
    },
    events2Typo: {
        color: "#8d9f9f",
        fontFamily: "Montserrat-SemiBold",
        lineHeight: 8,
        fontSize: 11,
        top: 44,
        textAlign: "center",
        fontWeight: "600",
        position: "absolute"
    },
    vectorIconPosition: {
        bottom: "44.12%",
        top: "23.53%",
        height: "32.35%",
        maxHeight: "100%",
        maxWidth: "100%",
        position: "absolute",
        overflow: "hidden"
    },
    xLayout: {
        height: 67,
        width: 67,
        position: "absolute"
    },
    xInnerPosition: {
        left: 14,
        position: "absolute"
    },
    text4Typo: {
        textAlign: "left",
        color: "#272f2f",
        fontFamily: "Roboto-Bold",
        fontWeight: "600",
        position: "absolute"
    },
    mathBorder1: {
        width: 363,
        borderWidth: 1,
        borderRadius: 12,

        shadowColor: "rgba(0, 0, 0, 0.06)",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 1,
        left: 15,
        borderColor: "#eaeaea",
        borderStyle: "solid",
        position: "absolute",
        overflow: "hidden"
    },
    mathBorder: {
        borderColor: "rgba(217, 217, 217, 0.6)",
        left: -1,
        top: -1,
        width: 363,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: "#fff",
        position: "absolute"
    },
    text2Typo: {
        lineHeight: 20,
        fontSize: 18,
        textAlign: "left",
        color: "#272f2f",
        fontFamily: "Roboto-Bold",
        fontWeight: "600"
    },
    textTypo: {
        fontWeight: "700",
        textAlign: "left",
        position: "absolute"
    },
    totalParentFlexBox: {
        alignItems: "center",
        flexDirection: "row",
        left: 12,
        position: "absolute"
    },
    coinsTypo: {
        fontFamily: "Roboto-Regular",
        lineHeight: 20,
        textAlign: "left",
        color: "#272f2f"
    },
    arrowLayout: {
        width: 32,
        borderRadius: 18,
        top: 52,
        height: 32,
        display: "none",
        position: "absolute"
    },
    frameChildLayout: {
        width: 84,
        position: "absolute"
    },
    getInTypo: {
        fontFamily: "Montserrat-ExtraBold",
        lineHeight: 12,
        fontSize: 12,
        fontWeight: "800",
        textAlign: "left",
        color: "#fff",
        position: "absolute"
    },
    addCoinsWrapperLayout: {
        height: 48,
        position: "absolute"
    },
    mathLayout: {
        width: 361,
        height: 68,
        left: 0,
        position: "absolute",
        overflow: "hidden"
    },
    chatgptLayout: {
        width: 44,
        height: 44
    },
    chatgptPosition1: {
        top: 78,
        width: 44,
        left: 14,
        height: 44,
        position: "absolute"
    },
    chatgptPosition: {
        top: 142,
        left: 14,
        position: "absolute"
    },
    bgLayout: {
        maxWidth: 393,
        flexGrow: 0,
        backgroundColor: "transparent",
        width: "100%",
        flex: 1
    },
    childLayout: {
        height: 58,
        width: 28,
        top: 1,
        position: "absolute"
    },
    undefinedLayout: {
        height: 24,
        position: "absolute"
    },
    groupLayout: {
        height: 3,
        borderRadius: 3,
        width: 29,
        backgroundColor: "#fff",
        left: 0,
        position: "absolute"
    },
    viewBg: {
        backgroundColor: "#f4f6f6",
        flex: 1
    },
    view: {
        height: 830,
        backgroundColor: "#f4f6f6",
        flex: 1
    },
    statusbar: {
        backgroundColor: "#010e0f",
        height: 42,
        left: "50%",
        top: 0,
        marginLeft: -196.5
    },
    statusbar2: {
        height: "100%",
        top: "0%",
        right: "0%",
        bottom: "0%",
        left: "0%",
        position: "absolute"
    },
    chatgptLayout1: {
        height: 0,
        width: 0
    },
    leftSide: {
        marginLeft: -168.5,
        top: 14
    },
    statusbarTime: {
        marginLeft: -27,
        borderRadius: 24,
        top: 0
    },
    time: {
        letterSpacing: -0.32,
        lineHeight: 21,
        fontFamily: "Inter-SemiBold",
        height: 20,
        textAlign: "center",
        fontWeight: "600",
        top: 1,
        color: "#fff",
        fontSize: 16,
        left: 0,
        width: 54,
        position: "absolute"
    },
    rightSide: {
        marginLeft: 92.5,
        top: 19,
        width: 77
    },
    statusbarBattery: {
        marginLeft: 11.3,
        width: 27,
        top: 0
    },
    outlineIcon: {
        marginTop: -6.5,
        right: 2,
        borderRadius: 4,
        opacity: 0.35,
        maxWidth: "100%",
        top: "50%",
        height: 13,
        left: 0,
        position: "absolute",
        overflow: "hidden"
    },
    batteryEndIcon: {
        marginTop: -1.5,
        right: 0,
        width: 1,
        height: 4,
        opacity: 0.4,
        top: "50%",
        position: "absolute"
    },
    fillIcon: {
        marginTop: -4.5,
        right: 10,
        borderRadius: 2,
        height: 9,
        left: 2,
        maxWidth: "100%",
        top: "50%",
        position: "absolute",
        overflow: "hidden"
    },
    wifiIcon: {
        marginLeft: -12.7,
        width: 17
    },
    iconMobileSignal: {
        marginLeft: -38.7,
        width: 18
    },
    mainBody: {
        top: 91,
        height: 739,
        left: 0
    },
    categories: {
        top: -26,
        elevation: 2,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2,
        shadowOpacity: 1,
        borderColor: "#ebebeb",
        borderBottomWidth: 1,
        display: "none",
        height: 44,
        borderStyle: "solid",
        backgroundColor: "#fff",
        width: 393,
        left: "50%",
        marginLeft: -196.5,
        position: "absolute",
        overflow: "hidden"
    },
    bottomNav: {
        bottom: 0,
        height: 68,
        width: 393,
        left: "50%",
        marginLeft: -196.5
    },
    unionIcon: {
        elevation: 10,
        shadowColor: "rgba(0, 0, 0, 0.16)",
        shadowOffset: { width: 0, height: -1 },
        shadowRadius: 10,
        shadowOpacity: 1,
        bottom: 0,
        height: 68,
        width: 393,
        left: 0
    },
    leaderboard: {
        marginTop: -34,
        marginLeft: -192.5,
        top: "50%",
        left: "50%"
    },
    leaderboard2: {
        color: "#008d9d",
        fontFamily: "Montserrat-SemiBold",
        lineHeight: 8,
        fontSize: 11,
        top: 44,
        left: 2,
        textAlign: "center",
        fontWeight: "600",
        position: "absolute"
    },
    leaderboardChild: {
        left: 27,
        width: 21,
        height: 23,
        top: 15,
        position: "absolute"
    },
    events: {
        left: 80,
        top: 0
    },
    events2: {
        left: 19
    },
    vectorIcon: {
        height: "23.53%",
        width: "32.89%",
        top: "27.94%",
        right: "32.89%",
        bottom: "48.53%",
        left: "34.21%",
        maxHeight: "100%",
        maxWidth: "100%",
        position: "absolute",
        overflow: "hidden"
    },
    profile: {
        left: 317,
        top: 0
    },
    profile2: {
        left: 20
    },
    vectorIcon2: {
        width: "23.68%",
        right: "38.16%",
        left: "38.16%"
    },
    referals: {
        left: 241,
        top: 0
    },
    referrals: {
        left: 13
    },
    vectorIcon3: {
        width: "28.95%",
        right: "35.53%",
        left: "35.53%"
    },
    x: {
        top: -2,
        left: 163
    },
    xChild: {
        left: 0,
        top: 0
    },
    xInner: {
        width: 39,
        height: 39,
        top: 14
    },
    instanceChild: {
        top: 3,
        left: 1,
        elevation: 2,
        shadowColor: "rgba(0, 0, 0, 0.25)",
        shadowOffset: { width: -2.5, height: -2.5 },
        shadowRadius: 1.78,
        shadowOpacity: 1,
        width: 37,
        height: 34,
        position: "absolute"
    },
    myTransactions: {
        top: 294,
        left: 16,
        lineHeight: 24,
        fontSize: 20
    },
    mathQuiz: {
        height: 260,
        top: 15
    },
    mathQuizChild: {
        borderRadius: 10,
        height: 260
    },
    currentBalance: {
        top: 16,
        left: 14,
        position: "absolute"
    },
    text: {
        top: 56,
        left: 76,
        fontSize: 32,
        lineHeight: 36,
        color: "#272f2f",
        fontFamily: "Roboto-Bold",
        fontWeight: "700"
    },
    totalCoinsBoughtParent: {
        top: 120,
        gap: 133
    },
    totalCoinsBought: {
        fontSize: 18,
        fontFamily: "Roboto-Regular"
    },
    totalCoinsEarnedParent: {
        top: 150,
        gap: 134
    },
    arrowUpRightUndefinedG: {
        right: 14,
        height: 32
    },
    rectangleParent: {
        borderRadius: 8,
        width: 84,
        left: 265,
        top: 46,
        height: 34,
        display: "none",
        overflow: "hidden"
    },
    frameChild: {
        elevation: 2,
        shadowColor: "#0e4f56",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 0,
        shadowOpacity: 1,

        borderRadius: 6,
        backgroundColor: "#008d9d",
        height: 32,
        left: 0,
        top: 0
    },
    frameChildPosition1: {
        opacity: 0.18,
        transform: [
            {
                rotate: "-19.7deg"
            }
        ],
        height: 57,
        width: 7,
        backgroundColor: "#f1f1f1",
        left: -4,
        top: -6,
        position: "absolute"
    },
    frameChildPosition: {
        width: 2,
        left: -11,
        top: -5,
        opacity: 0.18,
        transform: [
            {
                rotate: "-19.7deg"
            }
        ],
        height: 57,
        backgroundColor: "#f1f1f1",
        position: "absolute"
    },
    getIn: {
        left: 22,
        top: 10
    },
    chatgptImageOct2202511: {
        width: 56,
        height: 56,
        top: 46,
        left: 12,
        position: "absolute"
    },
    addCoinsWrapper: {
        marginTop: 64,
        marginLeft: -167.5,
        elevation: 24,
        shadowColor: "rgba(0, 0, 0, 0.12)",
        shadowOffset: { width: 2, height: 6 },
        shadowRadius: 24,
        shadowOpacity: 1,

        borderRadius: 48,
        width: 333,
        backgroundColor: "transparent",
        height: 48,
        top: "50%",
        left: "50%",
        overflow: "hidden"
    },
    addCoins: {
        marginTop: -12,
        marginLeft: -53.5,
        fontFamily: "Montserrat-Bold",
        lineHeight: 24,
        fontSize: 20,
        top: "50%",
        color: "#fff",
        fontWeight: "700",
        left: "50%"
    },
    keepEarningCoins: {
        marginLeft: -159.5,
        top: 616,
        lineHeight: 22,
        textTransform: "uppercase",
        fontStyle: "italic",
        fontFamily: "OpenSans-ExtraBoldItalic",
        color: "#bababa",
        fontWeight: "800",
        textAlign: "center",
        fontSize: 16,
        left: "50%",
        position: "absolute"
    },
    chevronDownUndefinedGly: {
        top: 295,
        left: 171,
        borderRadius: 22,
        width: 22,
        height: 22,
        display: "none",
        position: "absolute"
    },
    mathQuizParent: {
        top: 331,
        height: 206
    },
    mathQuiz2: {
        top: 0
    },
    mathQuizItem: {
        height: 70
    },
    mathQuizInner: {
        left: 279,
        width: 82,
        top: 0
    },
    coins: {
        top: 26,
        left: 66,
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        position: "absolute"
    },
    chatgptImageJul13202503Wrapper: {
        top: 14,
        height: 0,
        width: 0
    },
    chatgptImageJul13202503: {
        backgroundColor: "rgba(174, 189, 189, 0.2)",
        width: 44,
        borderRadius: 8,
        left: 0,
        top: 0,
        position: "absolute",
        display: "none"
    },
    chatgptImageJul13202503Container: {
        display: "none"
    },
    chatgptImageJul132025032: {
        backgroundColor: "rgba(174, 189, 189, 0.2)",
        width: 44,
        borderRadius: 8,
        left: 0,
        top: 0,
        position: "absolute"
    },
    chatgptImageJul13202503Frame: {
        height: 0,
        width: 0
    },
    arrowUpRightUndefinedG2: {
        right: 12,
        height: 32
    },
    lineView: {
        top: 132,
        borderTopWidth: 1,
        width: 335,
        height: 1,
        left: 12,
        borderColor: "#eaeaea",
        borderStyle: "solid",
        position: "absolute"
    },
    chatgptImageOct22025112: {
        width: 48,
        top: 10,
        left: 12
    },
    chatgptImageOct22025114: {
        width: 44,
        height: 44
    },
    text4: {
        top: 20,
        left: 269,
        fontSize: 24,
        lineHeight: 28
    },
    mathQuiz3: {
        top: 68
    },
    mathQuizChild3: {
        left: 271,
        width: 90,
        top: 0
    },
    mathQuiz4: {
        top: 136
    },
    viewAll: {
        marginLeft: 123.5,
        top: 298,
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        position: "absolute",
        left: "50%"
    },
    bg: {
        top: 41,
        left: 0,
        position: "absolute"
    },
    bgChild: {
        left: 128
    },
    bgItem: {
        left: 265,
        width: 28
    },
    bgInner: {
        left: 38
    },
    groupIcon: {
        left: 156
    },
    bgChild2: {
        left: 294
    },
    bgChild3: {
        left: 66
    },
    bgChild4: {
        left: 185
    },
    bgChild5: {
        left: 322
    },
    bgChild6: {
        left: 95
    },
    bgChild7: {
        left: 213
    },
    bgChild8: {
        left: 351
    },
    bgChild9: {
        left: 123
    },
    bgChild10: {
        left: 242
    },
    bgChild11: {
        left: 379
    },
    bgChild12: {
        left: 152
    },
    bgChild13: {
        left: 270
    },
    bgChild14: {
        left: 407
    },
    bgChild15: {
        left: 180
    },
    bgChild16: {
        left: -2
    },
    bgChild17: {
        left: 10
    },
    bgChild18: {
        left: 364
    },
    wallet: {
        marginLeft: -32.5,
        fontFamily: "OpenSans-Bold",
        top: 13,
        lineHeight: 24,
        fontSize: 20,
        color: "#fff",
        fontWeight: "700",
        left: "50%"
    },
    arrowUpUndefinedGlyph: {
        left: 18,
        width: 24,
        height: 24,
        top: 13
    },
    walletUndefinedGlyphUnParent: {
        left: 306,
        width: 69,
        top: 13,
        display: "none"
    },
    walletUndefinedGlyphUn: {
        width: 24,
        height: 24,
        left: 0,
        top: 0
    },
    text7: {
        left: 28,
        top: 6
    },
    rectangleParent2: {
        top: 18,
        left: 348,
        height: 15,
        width: 29,
        display: "none",
        position: "absolute"
    },
    groupChild: {
        top: 0
    },
    groupItem: {
        top: 6
    },
    groupInner: {
        top: 12
    }
});

export default WalletNowScreen;
