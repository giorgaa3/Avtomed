import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites(new Set());
      return;
    }
    const { data, error } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id);
    if (!error && data) {
      setFavorites(new Set(data.map((f: any) => f.product_id)));
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save favorites." });
      navigate("/auth");
      return;
    }
    setLoading(true);
    const isFav = favorites.has(productId);
    if (isFav) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      if (!error) {
        setFavorites((prev) => {
          const n = new Set(prev);
          n.delete(productId);
          return n;
        });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, product_id: productId });
      if (!error) {
        setFavorites((prev) => new Set(prev).add(productId));
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }
    setLoading(false);
  };

  const isFavorite = (productId: string) => favorites.has(productId);

  return { favorites, isFavorite, toggleFavorite, loading };
};
