import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editGoal } from "../lib/api";

export default function useEditGoal() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: editGoal,
        onSuccess: () => {
            ['savings', 'dashboard'].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }))
        }
    })
}
