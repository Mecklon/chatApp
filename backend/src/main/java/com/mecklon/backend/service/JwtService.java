package com.mecklon.backend.service;



import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


import javax.crypto.SecretKey;

import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

@Service
public class JwtService {


    private String secretKey = "hopop1h4145h13h51515h1i541i4peoyifhakdllkvbjjbvdiuyriywqeriyq39481249hifadsfhd";

//    public String generateSecretKey() {
//        try {
//            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
//            SecretKey secretKey = keyGen.generateKey();
//            System.out.println("Secret Key : " + secretKey.toString());
//            return Base64.getEncoder().encodeToString(secretKey.getEncoded());
//        } catch (NoSuchAlgorithmException e) {
//            throw new RuntimeException("Error generating secret key", e);
//        }
//    }
//
//    public JwtService(){
//        secretKey = generateSecretKey();
//    }


    public String generateJWT(String username) {
        return Jwts.builder()
                .claims(new HashMap<>())   // replaces setClaims
                .subject(username)         // replaces setSubject
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15)) // 15 min
                .signWith(getKey())        // algorithm inferred from key
                .compact();
    }

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes); // already a SecretKey
    }

    public String extractUserName(String token) {
        // extract the username from jwt token
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()                // ✅ new entry point
                .verifyWith(getKey()) // cast is needed, Keys.hmacShaKeyFor returns SecretKey
                .build()
                .parseSignedClaims(token)
                .getPayload();              // replaces getBody()
    }


    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
