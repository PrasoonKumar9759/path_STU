@Service
public class StreakService {

    public int updateStreak(LocalDate lastDay, LocalDate today, int currentStreak){

        if(lastDay.plusDays(1).equals(today)){
            return currentStreak + 1;
        }

        return 1;
    }
}