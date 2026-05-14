import { getTodosServerFn } from '#/modules/todos/todos.api';
import { createFileRoute } from '@tanstack/react-router'
import { Table, Link, Button, Modal } from '@heroui/react'
import { TrashBin, PencilToSquare, CircleQuestion } from "@gravity-ui/icons";


export const Route = createFileRoute('/_authed/dashboard/todos/')({
  component: RouteComponent,
  loader : async () => {
    const todos = await getTodosServerFn();
    return { todos };
  }
})

function RouteComponent() {
  const { todos } = Route.useLoaderData();
  return (
    <div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Todos Page</h3>
      </div>
      <Link className="mb-5" href="/dashboard/todos/create">
        Create New Todos
      </Link>
      <Table className="">
        <Table.ScrollContainer>
          <Table.Content aria-label="Team members">
            <Table.Header>
              <Table.Column isRowHeader defaultWidth="1fr" maxWidth={50}>
                No
              </Table.Column>
              <Table.Column defaultWidth="1fr" minWidth={150}>
                Title
              </Table.Column>
              <Table.Column defaultWidth="1fr" minWidth={150}>
                Content
              </Table.Column>
              <Table.Column defaultWidth="1fr" minWidth={150}>
                Category
              </Table.Column>
              <Table.Column defaultWidth="1fr" minWidth={150}>
                Status
              </Table.Column>
              <Table.Column defaultWidth="1fr" minWidth={150}>
                Action
              </Table.Column>
            </Table.Header>
            <Table.Body>
              {todos.map((todo, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{todo.title}</Table.Cell>
                  <Table.Cell>{todo.content}</Table.Cell>
                  <Table.Cell>{todo.category?.name || "-"}</Table.Cell>
                  <Table.Cell>{todo.completed ? "Completed" : "Not Completed"}</Table.Cell>
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
                              <Button className="w-full" slot="close"></Button>
                            </Modal.Footer>
                          </Modal.Dialog>
                        </Modal.Container>
                      </Modal.Backdrop>
                    </Modal>
                    <a
                      href={`/dashboard/category/${todo.id}/edit`}
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
