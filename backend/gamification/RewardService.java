@Service
public class RewardTokenService {

    public int addTokens(int currentTokens, int earned){

        return currentTokens + earned;
    }

    public int redeemTokens(int currentTokens, int cost){

        if(currentTokens >= cost){
            return currentTokens - cost;
        }

        return currentTokens;
    }
}