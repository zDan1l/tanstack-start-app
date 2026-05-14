import { createFileRoute } from "@tanstack/react-router";
import {
  Button,
  Input,
  Card,
  CardHeader,
  Link,
  Select,
  ListBox,
} from "@heroui/react";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { createTodoServerFn } from "#/modules/todos/todos.api";
import { getCategoriesServerFn } from "#/modules/categories/category.api";

export const Route = createFileRoute("/_authed/dashboard/todos/create")({
  component: RouteComponent,
  loader: async () => {
    const categories = await getCategoriesServerFn();
    return { categories };
  },
});

interface Category{
  id: string
  name: string
}

function RouteComponent() {
  const createTodoHandler = useServerFn(createTodoServerFn);
  const { categories } = Route.useLoaderData();
  const [isLoading, setIsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState<Record<string, string>>({});

  async function handleCreateTodos(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError({});
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const categoryId = formData.get("categoryId") as string;

    try {
      await createTodoHandler({
        data: {
          title,
          content,
          categoryId,
        },
      });
    } catch (err) {
      // Parse Zod validation error - support multiple fields
      const message = err instanceof Error ? err.message : String(err);
      try {
        const errorData = JSON.parse(message);
        if (Array.isArray(errorData)) {
          const errors: Record<string, string> = {};
          errorData.forEach((e: any) => {
            const field = e.path?.[0];
            if (field) {
              errors[field] = e.message;
            }
          });
          setError(errors);
        } else {
          setError({ _form: message });
        }
      } catch {
        setError({ _form: message });
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Reset error untuk field spesifik
  const handleInputChange = (fieldName: string) => {
    if (error[fieldName]) {
      setError((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Todo</h1>
        <p className="text-gray-500 text-sm">Add a new Todo</p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md font-semibold">Todos Information</p>
          </div>
        </CardHeader>
        <form className="space-y-4 p-4" onSubmit={handleCreateTodos}>
          <div className="flex flex-col gap-1">
            <Input
              name="title"
              placeholder="Enter Title Todo"
              onChange={(e) => handleInputChange(e.target.value)}
            />
            {error.title && (
              <span className="text-danger text-sm">{error.title}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Input
              name="content"
              placeholder="Enter Content"
              onChange={(e) => handleInputChange(e.target.value)}
            />
            {error.content && (
              <span className="text-danger text-sm">{error.content}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Select
              className="w-[256px]"
              placeholder="Select one"
              onChange={(key) => setCategoryId(key as string)}
              name="categoryId"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {categories?.map((category: Category) => (
                    <ListBox.Item
                      key={category.id}
                      textValue={category.name}
                      id={category.id}
                    >
                      {category.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
            {error.categoryId && (
              <span className="text-danger text-sm">{error.categoryId}</span>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" isDisabled={isLoading}>
              {isLoading ? "Loading.." : "Create Todo"}
            </Button>
            <Link href="/dashboard/todos">Cancel</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
