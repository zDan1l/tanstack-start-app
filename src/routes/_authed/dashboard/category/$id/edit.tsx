import { createFileRoute } from '@tanstack/react-router'
import { Button, Input, Card, CardHeader, Link } from '@heroui/react'
import { useServerFn } from '@tanstack/react-start'
import { getCategoryByIdServerFn, updateCategoryServerFn } from '#/modules/categories/category.api'
import { useState } from 'react'

export const Route = createFileRoute('/_authed/dashboard/category/$id/edit')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const category = await getCategoryByIdServerFn({
      data: { id: params.id }
    })
    return { category }
  }
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { category } = Route.useLoaderData()
  const updateCategoryHandler = useServerFn(updateCategoryServerFn)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ name?: string }>({});

  async function handleUpdateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError({});
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;

    try {
      await updateCategoryHandler({
        data: {
          id,
          name
        }
      });
    } catch (err) {
      // Parse Zod validation error
      const message = err instanceof Error ? err.message : String(err);
      try {
        const errorData = JSON.parse(message);
        if (Array.isArray(errorData)) {
          // Get first error message for name field
          const nameErrors = errorData
            .filter((e: any) => e.path?.[0] === "name")
            .map((e: any) => e.message);
          setError({ name: nameErrors[0] || "Validation failed" });
        } else {
          setError({ name: message });
        }
      } catch {
        // Not a JSON error, display as-is
        setError({ name: message });
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Reset error saat user mulai mengetik ulang
  const handleInputChange = () => {
    if (error.name) {
      setError({ name: undefined });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Category</h1>
        <p className="text-gray-500 text-sm">Update category information</p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md font-semibold">Category Information</p>
            <p className="text-small text-default-500">
              Update the details below
            </p>
          </div>
        </CardHeader>
        <form className="space-y-4 p-4" onSubmit={handleUpdateCategory}>
          <div className="flex flex-col gap-1">
            <Input
              name="name"
              placeholder="Enter category name"
              defaultValue={category?.name || ''}
              onChange={handleInputChange}
            />
            {error.name && (
              <span className="text-danger text-sm">{error.name}</span>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" isDisabled={isLoading}>
              {isLoading ? "Loading..." : "Save Change"}
            </Button>
            <Link href="/dashboard/category">Cancel</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
