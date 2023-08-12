"use client";
import { useEffect, useState } from "react";
import {
  Heading,
  Box,
  StatGroup,
  Stat,
  StatNumber,
  StatLabel,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem,
  SimpleGrid,
  Center,
  Flex,
  Stack,
  Text,
  CardHeader,
  CardBody,
  Card,
  StackDivider,
  Spacer,
  Avatar,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  ModalFooter,
  FormLabel,
  Input,
  ModalBody,
  Select,
  IconButton,
} from "@chakra-ui/react";
import Navbar from "../../components/navbar";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { isConstructorDeclaration } from "typescript";

export default function Dashboard() {
  const [present, setPresent] = useState(false);
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [owers, setOwers] = useState([
    {
      userId: "",
      amount: 0,
    },
  ]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const url = "http://localhost:3000";
  // const testUrl = "http://localhost:8000";

  const fetchData = async (userId: number) => {
    console.log("This is props");
    const fetchUrl = `/api/dashboard/${userId}`;
    console.log("this is fetch url", fetchUrl);
    fetch(fetchUrl)
      .then((data) => data.json())
      .then((data) => {
        console.log("THis is data", data);
        setData(data);
        setPresent(true);
      })
      .catch((err) => console.log("this is error", err));
  };

  const openModal = async () => {
    console.log("This is users", users);
    if (users.length === 0) {
      console.log("Fetching now");
      const fetchUrl = `/allUsers`;
      fetch(fetchUrl)
        .then((data) => data.json())
        .then((data) => {
          console.log("THis is users", data);
          setUsers(data.allUsers);
          setPresent(true);
        })
        .catch((err) => console.log("this is error", err));
    }
    setOpen(true);
  };

  const addOwer = () => {
    console.log("adding ower");
    const newOwer = {
      userId: "",
      amount: 0,
    };
    setOwers([...owers, newOwer]);
  };

  const removeOwer = () => {
    console.log("removing ower");
    if (owers.length === 1) {
      return;
    }
    const allOwers = [...owers];
    allOwers.pop();
    setOwers(allOwers);
  };

  const handleExpenseChange = (e: any, index: number) => {
    const { name, value } = e.target;
    console.log("This is value, name and index", value, name, index);
    const allOwers = [...owers];
    allOwers[index][name] = parseInt(value, 10);
    setOwers(allOwers);
  };

  const handleAmountChange = (e: any) => {
    const { value } = e.target;
    setAmount(parseInt(value, 10));
  };

  const handleSubmit = (e: any) => {
    setLoading(true);
    console.log("I am submitting now");
    const userId = 1;
    const body = {
      payerId: userId,
      amount,
      owers,
    };
    console.log("THis would be the submitting body", body);
    // const submitUrl = `${testUrl}/addExpense`;
    const myUrl = `/api/dashboard/1`;
    fetch(myUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((data) => data.json())
      .then(async (data) => {
        console.log("This is after submit", data);
        await fetchData(userId);
        setOpen(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    const userId = 1;
    fetchData(userId);
  }, []);

  return (
    <>
      <Navbar />
      <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        <Heading textAlign="center">Dashboard</Heading>
        <SimpleGrid
          columns={2}
          px={{ base: 2, sm: 12, md: 17 }}
          py={{ base: 10, sm: 22, md: 37 }}
        >
          <Stack alignContent="center" alignItems={"center"}>
            <Stat>
              <StatLabel>I Owe</StatLabel>
              <StatNumber color="red">₹{data?.owingAmount}</StatNumber>
              {/* <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText> */}
            </Stat>
          </Stack>
          <Stack alignContent="center" alignItems={"center"}>
            <Stat>
              <StatLabel>I Lent</StatLabel>
              <StatNumber color="green">₹{data?.lendingAmount}</StatNumber>
              {/* <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText> */}
            </Stat>
          </Stack>
        </SimpleGrid>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          variant="solid"
          onClick={() => openModal()}
        >
          Add a new Expense
        </Button>
        <Box py={{ base: 10, sm: 22, md: 37 }}>
          <Card>
            <CardHeader>
              <Heading size="lg">People You Owe to</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                {data?.owers.map((doc, index) => (
                  <Box key={index}>
                    <Flex>
                      {/* <Stack> */}
                      <Avatar
                        name="Segun Adebayo"
                        src="https://bit.ly/sage-adebayo"
                      />
                      <Heading
                        pt="2"
                        fontSize="sm"
                        px={{ base: 2, sm: 12, md: 17 }}
                      >
                        {doc.expense.payer.name}
                      </Heading>
                      {/* </Stack> */}
                      <Spacer />
                      <Heading size="md" color="red">
                        ₹{doc.amount}
                      </Heading>
                    </Flex>
                  </Box>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Box>
        <Box py={{ base: 10, sm: 22, md: 37 }}>
          <Card>
            <CardHeader>
              <Heading size="lg">People That Owe you</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                {data?.lentWithUsers.map((doc, index) => (
                  <Box key={index}>
                    <Flex>
                      {/* <Stack> */}
                      <Avatar
                        name="Segun Adebayo"
                        src="https://bit.ly/sage-adebayo"
                      />
                      <Heading
                        pt="2"
                        fontSize="sm"
                        px={{ base: 2, sm: 12, md: 17 }}
                      >
                        {doc.user.name}
                      </Heading>
                      <Spacer />
                      <Heading size="md" color="green">
                        ₹{doc._sum.amount}
                      </Heading>
                    </Flex>
                  </Box>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Box>
      </Box>
      <Modal isOpen={open} onClose={() => setOpen(false)} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl py={{ base: 5, sm: 15, md: 25 }}>
              <FormLabel>Amount</FormLabel>
              <Input
                placeholder="amount"
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => handleAmountChange(e)}
                required
              />
            </FormControl>
            {/* <Text>Owers</Text> */}
            <IconButton
              aria-label="Search database"
              onClick={() => addOwer()}
              icon={<AddIcon />}
              px={{ base: 2, sm: 12, md: 17 }}
            />
            <IconButton
              aria-label="Search database"
              onClick={() => removeOwer()}
              icon={<MinusIcon />}
              px={{ base: 2, sm: 12, md: 17 }}
            />
            {owers.map((ower, index) => (
              <Grid column={2} py={{ base: 10, sm: 22, md: 37 }} key={index}>
                <GridItem colSpan={3}>
                  <FormControl>
                    <FormLabel>Select User</FormLabel>
                    <Select
                      placeholder="User"
                      name="userId"
                      value={ower.userId}
                      onChange={(e) => handleExpenseChange(e, index)}
                      required
                    >
                      {users.map((user) => (
                        <option value={user.id} key={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </GridItem>
                <br />
                <GridItem colSpan={3}>
                  <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      placeholder="amount"
                      type="number"
                      name="amount"
                      value={ower.amount}
                      onChange={(e) => handleExpenseChange(e, index)}
                      required
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              colorScheme="blue"
              mr={3}
              onClick={(e) => handleSubmit(e)}
              isLoading={loading}
            >
              Save
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
