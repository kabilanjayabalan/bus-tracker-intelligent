import React, {useState, useRef, useEffect} from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, Animated, KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '../theme/ThemeContext';
import type {RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export function SignupScreen({navigation}: Props) {
  const {theme} = useTheme();
  const c = theme.colors;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  
  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(logoAnim, {toValue: 1, tension: 50, friction: 9, useNativeDriver: true}),
      Animated.spring(formAnim, {toValue: 1, tension: 50, friction: 9, useNativeDriver: true}),
      Animated.spring(buttonAnim, {toValue: 1, tension: 50, friction: 9, useNativeDriver: true}),
    ]).start();
  }, [logoAnim, formAnim, buttonAnim]);

  const handleSignup = () => {
    if (!name || !email || !password) {
      Alert.alert('Hold on', 'Please fill in all details.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Wait a sec', "Passwords don't match.");
      return;
    }
    navigation.replace('Home');
  };

  const handleGoogleSignup = () => {
    setTimeout(() => navigation.replace('Home'), 800);
  };

  return (
    <View style={[styles.container, {backgroundColor: c.primaryBg}]}>
      <StatusBar barStyle={c.statusBarStyle} backgroundColor={c.primaryBg} />
      
      <View style={[styles.bgCircle1, {backgroundColor: c.accentGlow}]} />
      <View style={[styles.bgCircle2, {backgroundColor: c.purpleGlow}]} />

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
        <Text style={[styles.backIcon, {color: c.textPrimary}]}>←</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <Animated.View style={[styles.logoSection, {
            opacity: logoAnim, transform: [{translateY: logoAnim.interpolate({inputRange: [0, 1], outputRange: [-40, 0]})}]
          }]}>
            <View style={[styles.logoContainer, {backgroundColor: c.accentSubtle, borderColor: c.accent}]}>
              <Text style={styles.logoEmoji}>🚌</Text>
            </View>
            <Text style={[styles.appName, {color: c.accent}]}>ROUTO</Text>
            <Text style={[styles.tagline, {color: c.textSecondary}]}>Create an account</Text>
          </Animated.View>

          <Animated.View style={[styles.formSection, {
            opacity: formAnim, transform: [{translateY: formAnim.interpolate({inputRange: [0, 1], outputRange: [40, 0]})}]
          }]}>
            <View style={[styles.inputContainer, {backgroundColor: c.cardBg, borderColor: c.border}]}>
              <Text style={[styles.inputIcon, {color: c.textMuted}]}>👤</Text>
              <TextInput style={[styles.input, {color: c.textPrimary}]} placeholder="Full Name" placeholderTextColor={c.textMuted} value={name} onChangeText={setName} />
            </View>

            <View style={[styles.inputContainer, {backgroundColor: c.cardBg, borderColor: c.border}]}>
              <Text style={[styles.inputIcon, {color: c.textMuted}]}>✉️</Text>
              <TextInput style={[styles.input, {color: c.textPrimary}]} placeholder="Email Address" placeholderTextColor={c.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={[styles.inputContainer, {backgroundColor: c.cardBg, borderColor: c.border}]}>
              <Text style={[styles.inputIcon, {color: c.textMuted}]}>🔒</Text>
              <TextInput style={[styles.input, {color: c.textPrimary}]} placeholder="Password" placeholderTextColor={c.textMuted} value={password} onChangeText={setPassword} secureTextEntry={!isPasswordVisible} />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeButton}>
                <Text style={styles.eyeIcon}>{isPasswordVisible ? '👁' : '👁‍🗨'}</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, {backgroundColor: c.cardBg, borderColor: c.border}]}>
              <Text style={[styles.inputIcon, {color: c.textMuted}]}>🔒</Text>
              <TextInput style={[styles.input, {color: c.textPrimary}]} placeholder="Confirm Password" placeholderTextColor={c.textMuted} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!isConfirmVisible} />
              <TouchableOpacity onPress={() => setIsConfirmVisible(!isConfirmVisible)} style={styles.eyeButton}>
                <Text style={styles.eyeIcon}>{isConfirmVisible ? '👁' : '👁‍🗨'}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View style={[styles.buttonSection, {
            opacity: buttonAnim, transform: [{translateY: buttonAnim.interpolate({inputRange: [0, 1], outputRange: [30, 0]})}]
          }]}>
            <TouchableOpacity style={[styles.loginButton, {backgroundColor: c.accent}]} onPress={handleSignup} activeOpacity={0.85}>
              <Text style={[styles.loginButtonText, {color: c.primaryBg}]}>SIGN UP</Text>
              <View style={styles.buttonGlow} />
            </TouchableOpacity>

            <View style={[styles.dividerRow]}>
              <View style={[styles.dividerLine, {backgroundColor: c.border}]} />
              <Text style={[styles.dividerText, {color: c.textSecondary}]}>OR</Text>
              <View style={[styles.dividerLine, {backgroundColor: c.border}]} />
            </View>

            <TouchableOpacity style={[styles.googleButton, {backgroundColor: theme.isDark ? '#FFFFFF' : '#FFFFFF', borderColor: c.border}]} onPress={handleGoogleSignup} activeOpacity={0.85}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.signupRow}>
              <Text style={[styles.signupText, {color: c.textSecondary}]}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.signupLink, {color: c.accent}]}>Log In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  bgCircle1: {position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: 140},
  bgCircle2: {position: 'absolute', bottom: -60, left: -100, width: 250, height: 250, borderRadius: 125},
  
  backButton: {
    position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, zIndex: 10,
    width: 40, height: 40, justifyContent: 'center',
  },
  backIcon: {fontSize: 28, fontWeight: '300'},

  keyboardView: {flex: 1},
  scrollContent: {flexGrow: 1, paddingHorizontal: 28, paddingVertical: 40, paddingTop: 80},
  
  logoSection: {alignItems: 'center', marginBottom: 35},
  logoContainer: {
    width: 80, height: 80, borderRadius: 24, borderWidth: 2, 
    alignItems: 'center', justifyContent: 'center', marginBottom: 16, 
    shadowColor: '#00E5A0', shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 8
  },
  logoEmoji: {fontSize: 34},
  appName: {fontSize: 28, fontWeight: '900', letterSpacing: 6},
  tagline: {fontSize: 14, marginTop: 4, letterSpacing: 0.5},
  
  formSection: {marginBottom: 24},
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 16, 
    borderWidth: 1, paddingHorizontal: 16, marginBottom: 14, height: 56
  },
  inputIcon: {fontSize: 16, marginRight: 12},
  input: {flex: 1, fontSize: 15, fontWeight: '500'},
  eyeButton: {padding: 4},
  eyeIcon: {fontSize: 18},
  
  buttonSection: {alignItems: 'center'},
  loginButton: {
    width: '100%', borderRadius: 16, height: 56, alignItems: 'center', 
    justifyContent: 'center', shadowColor: '#00E5A0', shadowOffset: {width: 0, height: 8}, 
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 8, overflow: 'hidden'
  },
  loginButtonText: {fontSize: 16, fontWeight: '800', letterSpacing: 2, zIndex: 2},
  buttonGlow: {
    position: 'absolute', top: -30, right: -30, width: 100, height: 100, 
    borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.15)'
  },
  
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 20
  },
  dividerLine: {flex: 1, height: 1},
  dividerText: {marginHorizontal: 12, fontSize: 12, fontWeight: '700'},

  googleButton: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 16, height: 56, borderWidth: 1, 
    shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4
  },
  googleIcon: {fontSize: 20, fontWeight: '900', color: '#DB4437', marginRight: 12, fontStyle: 'italic'},
  googleButtonText: {fontSize: 15, fontWeight: '700', color: '#444'},
  
  signupRow: {flexDirection: 'row', marginTop: 24, alignItems: 'center'},
  signupText: {fontSize: 14},
  signupLink: {fontSize: 14, fontWeight: '700'},
});
