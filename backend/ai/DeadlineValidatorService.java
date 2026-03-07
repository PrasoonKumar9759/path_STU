@Service
public class DeadlineValidatorService {

    public boolean isFeasible(int topics, int days){

        int requiredDays = topics * 2;

        return requiredDays <= days;
    }
}