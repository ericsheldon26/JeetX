import * as React from "react";
import { StyleSheet, View, Text, Image as RNImage, ScrollView } from "react-native";

const Image = (props: any) => <View {...props} style={[{ backgroundColor: 'rgba(255,255,255,0.1)' }, props.style]} ><RNImage {...props} style={{ display: 'none' }} /></View>;
import LinearGradient from "react-native-linear-gradient";
// import { SafeAreaView } from "react-native-safe-area-context"; // Original Windows/Native code
import ScreenWrapper from "../../components/ScreenWrapper"; // Linux/NewArch Fix


const AddCoins = () => {

    return (
        <ScreenWrapper 
          style={styles.addCoins}
          statusBarColor="#010e0f"
          statusBarStyle="light-content"
          backgroundColor="#f4f6f6"
        >
            {/* <SafeAreaView style={styles.viewBg}> */} {/* Original code */}

            <View style={[styles.view, styles.viewLayout]}>

                <View style={[styles.mainBody, styles.mainBodyLayout]}>
                    <View style={styles.categories} />

                    <Text style={[styles.chooseABundle, styles.chooseABundleFlexBox]}>Choose a Bundle</Text>
                    <Text style={[styles.note, styles.notePosition]}>Note:</Text>
                    <Text style={[styles.coinsAreNonRefundable, styles.youCurrentlyHaveTypo]}>Coins are non-refundable, Purchase secure via Payment Gatway</Text>
                    <View style={[styles.mathQuiz, styles.mathQuizLayout]}>
                        <LinearGradient style={styles.mathQuizChild} locations={[0, 1]} colors={['rgba(255, 207, 91, 0)', 'rgba(242, 179, 26, 0.56)']} useAngle={true} angle={90.15} />
                        <Text style={[styles.currentBalance, styles.noteFlexBox]}>Current Balance</Text>
                        <Text style={[styles.text, styles.textTypo2]}>3,450</Text>
                        <Image style={styles.arrowUpRightUndefinedG} resizeMode="cover" />
                        <View style={[styles.rectangleParent, styles.rectangleParentPosition]}>
                            <View style={[styles.frameChild, styles.wrapperBg]} />
                            <View style={[styles.frameItem, styles.frameTransform]} />
                            <View style={[styles.frameInner, styles.frameTransform]} />
                            <Text style={[styles.getIn, styles.getInTypo]}>Get IN</Text>
                        </View>
                        <Image style={styles.chatgptImageOct2202511} resizeMode="cover" />
                        <Text style={[styles.youCurrentlyHave, styles.rectangleParentPosition]}>You currently have</Text>
                    </View>
                    <Image style={styles.chevronDownUndefinedGly} resizeMode="cover" />
                    <View style={[styles.rectangleGroup, styles.rectangleParentLayout]}>
                        <View style={[styles.rectangleView, styles.mathQuizLayout]} />
                        <Image style={[styles.chatgptImageOct10202512, styles.leaderboardChildPosition]} resizeMode="cover" />
                        <Text style={[styles.text2, styles.textTypo1]}>65</Text>
                        <View style={[styles.wrapper, styles.wrapperBg]}>
                            <Text style={[styles.text3, styles.textTypo]}>₹ 11</Text>
                        </View>
                    </View>
                    <View style={[styles.rectangleContainer, styles.rectangleParentLayout]}>
                        <View style={[styles.rectangleView, styles.mathQuizLayout]} />
                        <Image style={[styles.chatgptImageOct10202512, styles.leaderboardChildPosition]} resizeMode="cover" />
                        <Text style={[styles.text4, styles.textTypo1]}>1600</Text>
                        <View style={[styles.wrapper, styles.wrapperBg]}>
                            <Text style={[styles.text5, styles.textTypo]}>₹ 220</Text>
                        </View>
                    </View>
                    <View style={[styles.frameView, styles.frameViewLayout]}>
                        <View style={[styles.rectangleView, styles.mathQuizLayout]} />
                        <Image style={[styles.chatgptImageOct10202512, styles.leaderboardChildPosition]} resizeMode="cover" />
                        <Text style={[styles.text6, styles.textTypo1]}>350</Text>
                        <View style={[styles.wrapper, styles.wrapperBg]}>
                            <Text style={[styles.text7, styles.textTypo]}>₹ 55</Text>
                        </View>
                    </View>
                    <View style={[styles.rectangleParent2, styles.frameViewLayout]}>
                        <View style={[styles.rectangleView, styles.mathQuizLayout]} />
                        <Text style={[styles.text4, styles.textTypo1]}>4200</Text>
                        <View style={[styles.wrapper, styles.wrapperBg]}>
                            <Text style={[styles.text5, styles.textTypo]}>₹ 550</Text>
                        </View>
                        <Image style={styles.chatgptImageOct102025124} resizeMode="cover" />
                    </View>
                    <View style={[styles.rectangleParent3, styles.rectangleParentLayout]}>
                        <View style={[styles.rectangleView, styles.mathQuizLayout]} />
                        <Image style={[styles.chatgptImageOct10202512, styles.leaderboardChildPosition]} resizeMode="cover" />
                        <Text style={[styles.text6, styles.textTypo1]}>750</Text>
                        <View style={[styles.wrapper, styles.wrapperBg]}>
                            <Text style={[styles.text5, styles.textTypo]}>₹ 110</Text>
                        </View>
                    </View>
                    <View style={[styles.rectangleParent4, styles.rectangleParentLayout]}>
                        <View style={[styles.rectangleView, styles.mathQuizLayout]} />
                        <Text style={[styles.text4, styles.textTypo1]}>8400</Text>
                        <View style={[styles.wrapper, styles.wrapperBg]}>
                            <Text style={[styles.text13, styles.textTypo]}>₹ 1100</Text>
                        </View>
                        <Image style={styles.chatgptImageOct102025124} resizeMode="cover" />
                    </View>
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
                        <Text style={[styles.addCoins2, styles.textTypo2]}>Add Coins</Text>
                        <Image style={[styles.arrowUpUndefinedGlyph, styles.undefinedLayout]} resizeMode="cover" />
                        <View style={[styles.walletUndefinedGlyphUnParent, styles.undefinedLayout]}>
                            <Image style={[styles.walletUndefinedGlyphUn, styles.undefinedLayout]} resizeMode="cover" />
                            <Text style={[styles.text14, styles.getInTypo]}>₹1,999</Text>
                        </View>
                        <View style={styles.groupView}>
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
    addCoins: {
        flex: 1,
        backgroundColor: "#f4f6f6"
    },
    viewLayout: {
        width: "100%",
        overflow: "hidden"
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
    bottomNavLayout: {
        height: 68,
        bottom: 0,
        width: 393,
        position: "absolute"
    },
    eventsLayout: {
        width: 76,
        height: 68,
        backgroundColor: "#fff",
        position: "absolute",
        overflow: "hidden"
    },
    leaderboardChildPosition: {
        left: 27,
        position: "absolute"
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
    chooseABundleFlexBox: {
        alignItems: "center",
        display: "flex"
    },
    notePosition: {
        top: 604,
        position: "absolute"
    },
    youCurrentlyHaveTypo: {
        fontFamily: "OpenSans-Regular",
        lineHeight: 20,
        textAlign: "left"
    },
    mathQuizLayout: {
        height: 84,
        position: "absolute"
    },
    noteFlexBox: {
        textAlign: "left",
        color: "#272f2f"
    },
    textTypo2: {
        fontWeight: "700",
        textAlign: "left",
        position: "absolute"
    },
    rectangleParentPosition: {
        top: 46,
        position: "absolute"
    },
    wrapperBg: {
        backgroundColor: "#008d9d",
        position: "absolute"
    },
    frameTransform: {
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
    getInTypo: {
        fontFamily: "Montserrat-ExtraBold",
        fontWeight: "800",
        lineHeight: 12,
        fontSize: 12,
        textAlign: "left",
        color: "#fff",
        position: "absolute"
    },
    rectangleParentLayout: {
        height: 144,
        width: 112,
        borderWidth: 1.4,
        borderColor: "#cd8117",
        backgroundColor: "#f6eed6",
        borderRadius: 11,
        elevation: 5.66,
        boxShadow: "0px 2.8311688899993896px 5.66px rgba(0, 0, 0, 0.25)",
        borderStyle: "solid",
        position: "absolute",
        overflow: "hidden"
    },
    textTypo1: {
        lineHeight: 23,
        fontSize: 17,
        top: 59,
        textAlign: "left",
        color: "#272f2f",
        fontFamily: "Roboto-Bold",
        fontWeight: "600",
        position: "absolute"
    },
    textTypo: {
        lineHeight: 25,
        textAlign: "left",
        fontFamily: "Roboto-Bold",
        fontSize: 20,
        top: 3,
        color: "#fff",
        fontWeight: "600",
        position: "absolute"
    },
    frameViewLayout: {
        left: 141,
        height: 144,
        width: 112,
        borderWidth: 1.4,
        borderColor: "#cd8117",
        backgroundColor: "#f6eed6",
        borderRadius: 11,
        elevation: 5.66,
        boxShadow: "0px 2.8311688899993896px 5.66px rgba(0, 0, 0, 0.25)",
        borderStyle: "solid",
        position: "absolute",
        overflow: "hidden"
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
        overflow: "hidden",
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
        position: "absolute",
        overflow: "hidden"
    },
    notch: {
        width: 0,
        height: 0
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
        fontSize: 16,
        letterSpacing: -0.32,
        lineHeight: 21,
        fontFamily: "Inter-SemiBold",
        height: 20,
        textAlign: "center",
        top: 1,
        color: "#fff",
        fontWeight: "600",
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
        borderRadius: 2,
        height: 9,
        left: 2,
        right: 10,
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
        boxShadow: "inset 0px 0px 2px rgba(0, 0, 0, 0.2)",
        borderColor: "#ebebeb",
        borderBottomWidth: 1,
        height: 44,
        display: "none",
        borderStyle: "solid",
        backgroundColor: "#fff",
        width: 393,
        left: "50%",
        marginLeft: -196.5,
        position: "absolute",
        overflow: "hidden"
    },
    bottomNav: {
        left: "50%",
        marginLeft: -196.5
    },
    unionIcon: {
        boxShadow: "0px -1px 10.2px rgba(0, 0, 0, 0.16)",
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
        top: 15,
        width: 21,
        height: 23
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
        left: 14,
        top: 14,
        position: "absolute"
    },
    instanceChild: {
        left: 1,
        boxShadow: "-2.538658618927002px -2.538658618927002px 1.78px rgba(0, 0, 0, 0.25)",
        width: 37,
        height: 34,
        top: 3,
        position: "absolute"
    },
    chooseABundle: {
        top: 114,
        width: 151,
        height: 33,
        textAlign: "left",
        color: "#272f2f",
        fontFamily: "Roboto-Bold",
        lineHeight: 24,
        fontSize: 20,
        left: 18,
        fontWeight: "600",
        position: "absolute"
    },
    note: {
        fontSize: 18,
        lineHeight: 22,
        fontWeight: "500",
        fontFamily: "Roboto-Medium",
        width: 45,
        textAlign: "left",
        color: "#272f2f",
        left: 18
    },
    coinsAreNonRefundable: {
        left: 70,
        fontSize: 15,
        color: "#646e6e",
        width: 304,
        top: 604,
        position: "absolute",
        alignItems: "center",
        display: "flex"
    },
    mathQuiz: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.06)",
        elevation: 4,
        borderRadius: 12,
        width: 359,
        borderWidth: 1,
        borderColor: "#cf8712",
        height: 84,
        left: 17,
        top: 13,
        borderStyle: "solid",
        overflow: "hidden"
    },
    mathQuizChild: {
        top: -1,
        left: -1,
        borderRadius: 10,
        width: 360,
        backgroundColor: "transparent",
        height: 84,
        borderWidth: 1,
        borderColor: "#cf8712",
        borderStyle: "solid",
        position: "absolute"
    },
    currentBalance: {
        top: 16,
        fontFamily: "Roboto-Bold",
        lineHeight: 24,
        fontSize: 20,
        left: 14,
        fontWeight: "600",
        textAlign: "left",
        position: "absolute"
    },
    text: {
        top: 23,
        left: 263,
        fontSize: 32,
        lineHeight: 36,
        color: "#272f2f",
        fontFamily: "Roboto-Bold"
    },
    arrowUpRightUndefinedG: {
        top: 52,
        borderRadius: 18,
        width: 32,
        height: 32,
        display: "none",
        right: 10,
        position: "absolute"
    },
    rectangleParent: {
        borderRadius: 8,
        width: 84,
        left: 265,
        height: 34,
        display: "none",
        overflow: "hidden"
    },
    frameChild: {
        boxShadow: "0px 2px 0px #0e4f56",
        elevation: 0,
        borderRadius: 6,
        width: 84,
        height: 32,
        left: 0,
        top: 0
    },
    frameItem: {
        top: -6,
        left: -4,
        width: 7
    },
    frameInner: {
        top: -5,
        left: -11,
        width: 2
    },
    getIn: {
        top: 10,
        left: 22
    },
    chatgptImageOct2202511: {
        top: 11,
        left: 197,
        width: 60,
        height: 60,
        position: "absolute"
    },
    youCurrentlyHave: {
        fontSize: 14,
        fontFamily: "OpenSans-Regular",
        lineHeight: 20,
        textAlign: "left",
        color: "#272f2f",
        left: 14
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
    rectangleGroup: {
        top: 156,
        left: 17,
        width: 112,
        borderWidth: 1.4,
        borderColor: "#cd8117",
        backgroundColor: "#f6eed6",
        borderRadius: 11,
        elevation: 5.66,
        boxShadow: "0px 2.8311688899993896px 5.66px rgba(0, 0, 0, 0.25)"
    },
    rectangleView: {
        backgroundColor: "#f5e4b3",
        width: 109,
        left: 0,
        top: 0
    },
    chatgptImageOct10202512: {
        width: 55,
        height: 53,
        top: 6
    },
    text2: {
        left: 45
    },
    wrapper: {
        top: 96,
        left: 11,
        boxShadow: "0px 1.4155844449996948px 1.42px rgba(0, 0, 0, 0.49)",
        elevation: 1.42,
        borderRadius: 7,
        width: 86,
        height: 31
    },
    text3: {
        left: 24
    },
    rectangleContainer: {
        top: 312,
        left: 17,
        width: 112,
        borderWidth: 1.4,
        borderColor: "#cd8117",
        backgroundColor: "#f6eed6",
        borderRadius: 11,
        elevation: 5.66,
        boxShadow: "0px 2.8311688899993896px 5.66px rgba(0, 0, 0, 0.25)"
    },
    text4: {
        marginLeft: -20.9,
        left: "50%"
    },
    text5: {
        marginLeft: -25.52,
        left: "50%"
    },
    frameView: {
        top: 156
    },
    text6: {
        marginLeft: -15.9,
        left: "50%"
    },
    text7: {
        marginLeft: -19.52,
        left: "50%"
    },
    rectangleParent2: {
        top: 312
    },
    chatgptImageOct102025124: {
        left: 31,
        width: 47,
        height: 52,
        top: 6,
        position: "absolute"
    },
    rectangleParent3: {
        top: 156,
        left: 265
    },
    rectangleParent4: {
        top: 312,
        left: 265
    },
    text13: {
        marginLeft: -30.52,
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
        left: 265
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
    addCoins2: {
        marginLeft: -49.5,
        fontFamily: "OpenSans-Bold",
        top: 13,
        lineHeight: 24,
        fontSize: 20,
        color: "#fff",
        fontWeight: "700",
        left: "50%"
    },
    arrowUpUndefinedGlyph: {
        width: 24,
        height: 24,
        top: 13,
        left: 18
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
    text14: {
        left: 28,
        top: 6
    },
    groupView: {
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

export default AddCoins;
