import { z } from "zod";
import { redis } from "@/utils/redis";

const categorySchema = z.object({
  category: z.string(),
});

export type RedisCategory = z.infer<typeof categorySchema>;

function getKey(email: string) {
  return `categories:${email}`;
}

function getCategoryKey(commentId: string) {
  return `category:${commentId}`;
}

export async function getCategory(options: {
  email: string;
  commentId: string;
}) {
  const key = getKey(options.email);
  const categoryKey = getCategoryKey(options.commentId);
  const category = await redis.hget<RedisCategory>(key, categoryKey);
  if (!category) return null;
  return { ...category, id: categoryKey };
}

//TODO: If i do this, filtering by date will not work need to figure it out
export async function getCategoryCounts(options: { email: string }) {
  const key = getKey(options.email);
  const categories = await redis.hgetall(key);

  if (!categories) return null;

  const categoryCounts = Object.entries(categories).reduce(
    (acc, [, value]) => {
      const categoryData = categorySchema.safeParse(JSON.parse(value as any));
      if (categoryData.success) {
        const categoryName = categoryData.data.category;
        acc[categoryName] = (acc[categoryName] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return categoryCounts;
}

export async function saveCategory(options: {
  email: string;
  commentId: string;
  category: RedisCategory;
}) {
  const key = getKey(options.email);
  const categoryKey = getCategoryKey(options.commentId);
  return redis.hset(key, { [categoryKey]: options.category });
}

export async function deleteCategory(options: {
  email: string;
  commentId: string;
}) {
  const key = getKey(options.email);
  const categoryKey = getCategoryKey(options.commentId);
  return redis.hdel(key, categoryKey);
}

export async function deleteCategories(options: { email: string }) {
  const key = getKey(options.email);
  return redis.del(key);
}
