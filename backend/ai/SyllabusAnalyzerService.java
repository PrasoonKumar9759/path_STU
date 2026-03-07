@Service
public class SyllabusAnalyzerService {

    public Map<String, String> analyze(List<String> topics){

        Map<String,String> difficulty = new HashMap<>();

        for(String topic : topics){

            if(topic.equals("Graphs") || topic.equals("Dynamic Programming")){
                difficulty.put(topic,"Hard");
            }
            else if(topic.equals("Trees") || topic.equals("LinkedList")){
                difficulty.put(topic,"Medium");
            }
            else{
                difficulty.put(topic,"Easy");
            }
        }

        return difficulty;
    }
}