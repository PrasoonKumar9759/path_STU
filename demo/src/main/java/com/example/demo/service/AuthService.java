package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.security.JwtService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ObjectMapper objectMapper;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .provider(User.AuthProvider.LOCAL)
                .build();

        userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        return buildAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        return buildAuthResponse(user, token);
    }

    public AuthResponse googleAuth(GoogleAuthRequest request) {
        try {
            // Decode Google JWT credential to extract user info
            String[] parts = request.getCredential().split("\\.");
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            JsonNode jsonNode = objectMapper.readTree(payload);

            String email = jsonNode.get("email").asText();
            String name = jsonNode.get("name").asText();
            String picture = jsonNode.has("picture") ? jsonNode.get("picture").asText() : null;
            String googleId = jsonNode.get("sub").asText();

            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = User.builder()
                                .email(email)
                                .name(name)
                                .profilePicture(picture)
                                .provider(User.AuthProvider.GOOGLE)
                                .providerId(googleId)
                                .build();
                        return userRepository.save(newUser);
                    });

            // Update profile picture if changed
            if (picture != null && !picture.equals(user.getProfilePicture())) {
                user.setProfilePicture(picture);
                userRepository.save(user);
            }

            CustomUserDetails userDetails = new CustomUserDetails(user);
            String token = jwtService.generateToken(userDetails);

            return buildAuthResponse(user, token);

        } catch (Exception e) {
            throw new RuntimeException("Failed to process Google authentication: " + e.getMessage());
        }
    }

    public UserDto getCurrentUser(CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .totalXp(user.getTotalXp())
                .currentStreak(user.getCurrentStreak())
                .longestStreak(user.getLongestStreak())
                .build();
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .totalXp(user.getTotalXp())
                .currentStreak(user.getCurrentStreak())
                .build();
    }
}
