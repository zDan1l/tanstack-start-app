import { deleteCategoryServerFn, getCategoriesServerFn } from '#/modules/categories/category.api';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod'
import { Table, Link, Button, Modal } from '@heroui/react'
import { TrashBin, PencilToSquare, CircleQuestion } from "@gravity-ui/icons";
import { useServerFn } from '@tanstack/react-start';

export const Route = createFileRoute('/_authed/dashboard/category/')({
  component: RouteComponent,
  loader: async() => {
    const categories = await getCategoriesServerFn();
    return { categories };
  },
  validateSearch: (search: Record<string, string>) => ({
    success : z.string().optional().parse(search.success)
  })
})

function RouteComponent() {
  const { success } = Route.useSearch();
  const navigate = useNavigate();
  const { categories } = Route.useLoaderData();
  const hasShowToast = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (success && !hasShowToast.current) {
      hasShowToast.current=true;
      toast.success(success)
      return () => {
        navigate({ to: ".", search: {}})
      }
    }
  }, [success])

  const deleteCategory = useServerFn(deleteCategoryServerFn);

  async function handlerDelete(id: string){
    setIsLoading(true);
    await deleteCategory({
      data : {
        id
      }
    })
    setIsLoading(false)
  }

  return (
    <div>
      <Link className="mb-5" href="/dashboard/category/create">
        Create New Category
      </Link>
      <Table className="">
        <Table.ScrollContainer>
          <Table.Content aria-label="Team members">
            <Table.Header>
              <Table.Column isRowHeader defaultWidth="1fr" maxWidth={50}>
                No
              </Table.Column>
              <Table.Column defaultWidth="1fr" minWidth={150}>
                Name
              </Table.Column>
              <Table.Column defaultWidth="1fr" minWidth={150}>
                Action
              </Table.Column>
            </Table.Header>
            <Table.Body>
              {categories.map((category, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{category.name}</Table.Cell>
                  <Table.Cell className="gap-2 flex">
                    <Modal>
                      <Button variant="danger">
                        <TrashBin />
                        Delete
                      </Button>
                      <Modal.Backdrop>
                        <Modal.Container>
                          <Modal.Dialog className="sm:max-w-[360px]">
                            <Modal.CloseTrigger />
                            <Modal.Header>
                              <Modal.Icon className="bg-default text-foreground">
                                <CircleQuestion className="size-5" />
                              </Modal.Icon>
                              <Modal.Heading>Delete Category</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                              <p>Are you sure to deleted this category</p>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                className="w-full"
                                slot="close"
                                onClick={() => handlerDelete(category.id)}
                                isDisabled={isLoading}
                              >
                                {isLoading ? "Loading.." : "Yes"}
                              </Button>
                            </Modal.Footer>
                          </Modal.Dialog>
                        </Modal.Container>
                      </Modal.Backdrop>
                    </Modal>
                    <a
                      href={`/dashboard/category/${category.id}/edit`}
                      className="flex align-center gap-1 font-medium py-2 px-4 bg-blue-500 max-w-fit text-white rounded-full"
                    >
                      <PencilToSquare />
                      Edit
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}
