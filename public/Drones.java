import java.util.*;

public class Drones {

    // Constants we use.
    final public static int SIZE = 8;
    final public static int NUMBITS = 6;
    final public static int[] DX = {-1, 0, 0, 1};
    final public static int[] DY = {0, -1, 1, 0};
    final public static String[] DIRECTIONS = {"UP", "LEFT", "RIGHT", "DOWN"};

    // Handy to have access to.
    public static int n;
    public static boolean[] canfly;
    public static int[] home;

    public static void main(String[] args) {

        Scanner stdin = new Scanner(System.in);
        n = stdin.nextInt();

        // Will store both the initial position and end position as bitmasks.
        int initPos = 0, endPos = 0;

        // Set up our arrays to store where we can go and each drone's destination.
        canfly = new boolean[SIZE * SIZE];
        Arrays.fill(canfly, true);
        home = new int[n];

        // Read in the initial grid.
        for (int i = 0; i < SIZE * SIZE; i++) {

            // Get next entry.
            char[] tmp = stdin.next().toCharArray();

            // tmp[1]-'1' is the 0 based drone number. Drone 0 is in bits 0-5, 
            // Drone 1 is in bits 6-11, etc.
            if (tmp[0] == 'D')
                initPos |= (i << ((tmp[1] - '1') * NUMBITS));

            // Works the same exact way for the ending position.
            if (tmp[0] == 'G') {
                endPos |= (i << ((tmp[1] - '1') * NUMBITS));
                home[tmp[1] - '1'] = i;
            }

            // This is easy to mark.
            if (tmp[0] == 'X')
                canfly[i] = false;
        }

        // Get the shortest path and moves
        Result result = bfs(initPos, endPos);
        if (result == null) {
            System.out.println("{\"distance\": -1, \"moves\": []}");
        } else {
            System.out.println("{\"distance\": " + result.distance + ", \"moves\": " + result.getMovesAsJson() + "}");
        }
    }

    // Return the shortest path from board position start to board position end.
    // Return null if it's not possible to transform from start to end.
    public static Result bfs(int start, int end) {

        // Set up BFS.
        ArrayDeque<Integer> q = new ArrayDeque<>();
        Map<Integer, Integer> dist = new HashMap<>();
        Map<Integer, Integer> parent = new HashMap<>();
        Map<Integer, String> moveDirection = new HashMap<>();

        dist.put(start, 0);
        q.offer(start);

        // Run BFS.
        while (q.size() > 0) {

            // Get the next item.
            int cur = q.poll();

            // Ta da!
            if (cur == end) {
                List<String> moves = reconstructPath(parent, moveDirection, start, end);
                return new Result(dist.get(cur), moves);
            }

            // Get the next possible positions.
            List<Integer> nextPositions = getNext(cur);

            // Enqueue all new positions, marking their distance and parent.
            for (int dir = 0; dir < nextPositions.size(); dir++) {
                int next = nextPositions.get(dir);
                if (dist.containsKey(next)) continue;
                dist.put(next, dist.get(cur) + 1);
                parent.put(next, cur);
                moveDirection.put(next, DIRECTIONS[dir]);
                q.offer(next);
            }
        }

        // If we get here, we can't do it.
        return null;
    }

    // Reconstructs the path from end to start using the parent map.
    public static List<String> reconstructPath(Map<Integer, Integer> parent, Map<Integer, String> moveDirection, int start, int end) {
        LinkedList<String> path = new LinkedList<>();
        for (int at = end; at != start; at = parent.get(at)) {
            path.addFirst(moveDirection.get(at));
        }
        return path;
    }

    // Returns all possible new board positions from the current board position, curPos.
    public static List<Integer> getNext(int curPos) {

        List<Integer> res = new ArrayList<>();

        // We'll try the remote in each of the four directions.
        for (int dir = 0; dir < DX.length; dir++) {

            // We'll store the new board position when applying this move here.
            int newPos = 0;

            // Work out where each drone will end up.
            for (int i = 0; i < n; i++) {

                // Isolate the six bits for this drone.
                int curCode = (curPos >> (NUMBITS * i)) & ((1 << NUMBITS) - 1);

                // Where we would go if we moved.
                int nX = curCode / SIZE + DX[dir];
                int nY = curCode % SIZE + DY[dir];
                int newCode = -1;

                // These are the reasons we don't move.
                if (!inbounds(nX, nY) || blocked(nX * SIZE + nY, i) || curCode == home[i])
                    newCode = curCode;

                // We're good.
                else
                    newCode = nX * SIZE + nY;

                // Update the new position.
                newPos |= (newCode << (NUMBITS * i));
            }

            // Add this to our result.
            res.add(newPos);
        }

        return res;
    }

    // Returns true iff (x,y) is inbounds in the grid.
    public static boolean inbounds(int x, int y) {
        return x >= 0 && x < SIZE && y >= 0 && y < SIZE;
    }

    // Returns true iff this code (location) is blocked for drone dI.
    public static boolean blocked(int code, int dI) {

        // No fly zone.
        if (!canfly[code]) return true;

        // Try each drone to see if it's going by a different group's end spot.
        for (int i = 0; i < n; i++) {

            // Skip this, it's okay for me to go here.
            if (i == dI) continue;

            // We can't go here because it's some other group's home.
            if (home[i] == code) return true;
        }

        // If we get here, we're good.
        return false;
    }

    // Class to store the result of the BFS.
    public static class Result {
        int distance;
        List<String> moves;

        public Result(int distance, List<String> moves) {
            this.distance = distance;
            this.moves = moves;
        }

        public String getMovesAsJson() {
            StringBuilder sb = new StringBuilder();
            sb.append("[");
            for (int i = 0; i < moves.size(); i++) {
                sb.append("\"").append(moves.get(i)).append("\"");
                if (i < moves.size() - 1) {
                    sb.append(", ");
                }
            }
            sb.append("]");
            return sb.toString();
        }
    }
}
