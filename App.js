import { useState } from "react"
import { StyleSheet, Text, View, Modal, TouchableOpacity, SafeAreaView, FlatList, TextInput, Platform, ScrollView, Alert } from "react-native"

export default function App() {
  // Controle de visibilidade dos Modais
  const [modalGet, setModalGetVisivel] = useState(false)
  const [modalPut, setModalPutVisivel] = useState(false)
  const [modalPost, setModalPostVisivel] = useState(false)
  const [modalDelete, setModalDeleteVisivel] = useState(false)

  // Para armazenar os dados do cliente
  const [data, setData] = useState([])

  // Para armazenar mensagens de erro (controle)
  const [erroMsg, setErroMsg] = useState("")

  // Informações do cliente
  const [id, setId] = useState("")
  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")

  // Configuração Backend -----------------------------------
  const ipLocal = "192.168.15.6"
  const porta = "3000"
  const URL_API = `http://${ipLocal}:${porta}`

  // Função fetch para metodos GET, POST, PUT e DELETE

  const metodoGetAll = async () => {
    try {
      const response = await fetch(`${URL_API}/clientes/`)
      const dadosBD = await response.json()
      setData(dadosBD)
    } catch (error) {
      setErroMsg("Erro ao buscar dados do cliente")
    }
  }

  const metodoGetId = async () => {
    try {
      const response = await fetch(`${URL_API}/clientes/${id}`)
      const dadosBD = await response.json()
      setData([dadosBD])
    } catch (error) {
      setErroMsg("Erro ao buscar dados do cliente")
    }
  }

  const metodoPost = async () => {
    try {
      const response = await fetch(`${URL_API}/clientes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome,
          cpf: cpf,
          email: email,
          telefone: telefone,
        }),
      })
      const dadosBD = await response.json()
      setData([dadosBD])
      limparCampos()
    } catch (error) {
      setErroMsg("Erro ao cadastrar cliente")
    }
  }

  const metodoPut = async () => {
    try {
      metodoGetId()
    } catch (error) {
      console.log(error)
    }

    console.log(data)
    
    try {
      const response = await fetch(`${URL_API}/clientes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.trim() ? nome : data.nome,
          cpf: cpf.trim() ? cpf : data.cpf,
          email: email.trim() ? email : data.email,
          telefone: telefone.trim() ? telefone : data.telefone,
        }),
      })
      const dadosBD = await response.json()
      setData([dadosBD])
      limparCampos()
    } catch (error) {
      setErroMsg("Erro ao atualizar cliente")
    }
  }

  const metodoDelete = async () => {
    try {
      const response = await fetch(`${URL_API}/clientes/${id}`, {
        method: "DELETE",
      })
      const dadosBD = await response.json()
      setData([dadosBD])
      limparCampos()
    } catch (error) {
      setErroMsg("Erro ao deletar cliente")
    }
  }

  // Validações
  const validarCamposGetId = () => {
    if (!id) {
      setErroMsg("Digite o ID do cliente")
      return
    }
    setErroMsg("")
    metodoGetId()
  }

  const validarCamposPut = () => {
    if (!id) {
      setErroMsg("Digite o ID do cliente para atualizar")
      return
    }
    if (!nome && !cpf && !email && !telefone) {
      setErroMsg("Digite ao menos um campo para atualizar")
      return
    }
    setErroMsg("")
    metodoPut()
    setModalPutVisivel(false)
  }

  const validarCamposPost = () => {
    if (!nome || !cpf || !email || !telefone) {
      setErroMsg("Preencha todos os campos")
      return
    }
    setErroMsg("")
    metodoPost()
    setModalPostVisivel(false)
  }

  const validarCamposDelete = () => {
    if (!id) {
      setErroMsg("Digite o ID do cliente")
      return
    }
    setErroMsg("")
    metodoDelete()

    Alert.alert(
      "Sucesso!",
      "Cliente deletado com sucesso.",
      [
        { text: "OK", onPress: () => setModalDeleteVisivel(false) },
      ]
    )
  }

  const limparCampos = () => {
    setId("")
    setNome("")
    setCpf("")
    setEmail("")
    setTelefone("")
  }

  // Renderização do item
  const renderizarItem = ({ item }) => (
    <View style={styles.cardCliente}>
      <Text style={styles.cardId}>ID: <Text style={styles.cardValue}>{item.id}</Text></Text>
      <Text style={styles.cardLabel}>Nome: <Text style={styles.cardValue}>{item.nome}</Text></Text>
      <Text style={styles.cardLabel}>CPF: <Text style={styles.cardValue}>{item.cpf}</Text></Text>
      <Text style={styles.cardLabel}>Email: <Text style={styles.cardValue}>{item.email}</Text></Text>
      <Text style={styles.cardLabel}>Telefone: <Text style={styles.cardValue}>{item.telefone}</Text></Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Gerenciamento de Clientes</Text>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: "#2196F3" }]}
          onPress={() => setModalGetVisivel(true)}
        >
          <Text style={styles.menuButtonText}>GET</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: "#4CAF50" }]}
          onPress={() => setModalPutVisivel(true)}
        >
          <Text style={styles.menuButtonText}>PUT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: "#FF9800" }]}
          onPress={() => setModalPostVisivel(true)}
        >
          <Text style={styles.menuButtonText}>POST</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: "#F44336" }]}
          onPress={() => setModalDeleteVisivel(true)}
        >
          <Text style={styles.menuButtonText}>DELETE</Text>
        </TouchableOpacity>
      </View>

      {/* Modal GET */}
      <Modal
        visible={modalGet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalGetVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalArea}>
            <Text style={styles.modalTitulo}>Lista de Clientes</Text>
            <View style={styles.rowButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#2196F3" }]}
                onPress={metodoGetAll}
              >
                <Text style={styles.actionButtonText}>Buscar Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#2196F3" }]}
                onPress={validarCamposGetId}
              >
                <Text style={styles.actionButtonText}>Buscar por ID</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="ID do Cliente"
              value={id}
              onChangeText={setId}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#888"
            />
            {erroMsg ? <Text style={styles.erroMsg}>{erroMsg}</Text> : null}
            <FlatList
              data={data}
              keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
              renderItem={renderizarItem}
              style={styles.lista}
              ListEmptyComponent={<Text style={{ textAlign: "center", color: "#555", marginTop: 20 }}>Nenhum cliente encontrado.</Text>}
            />
            <TouchableOpacity
              style={styles.fecharButton}
              onPress={() => { setModalGetVisivel(false); setErroMsg(""); setData([]); setId(""); }}
            >
              <Text style={styles.fecharButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal PUT */}
      <Modal
        visible={modalPut}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalPutVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalArea}>
            <ScrollView>
              <Text style={styles.modalTitulo}>Atualizar Cliente</Text>
              <TextInput
                placeholder="ID do Cliente"
                value={id}
                onChangeText={setId}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
                maxLength={90}
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="CPF"
                value={cpf}
                onChangeText={setCpf}
                maxLength={15}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                maxLength={64}
                keyboardType="email-address"
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Telefone"
                value={telefone}
                onChangeText={setTelefone}
                maxLength={30}
                keyboardType="phone-pad"
                style={styles.input}
                placeholderTextColor="#888"
              />
              {erroMsg ? <Text style={styles.erroMsg}>{erroMsg}</Text> : null}
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
                onPress={validarCamposPut}
              >
                <Text style={styles.actionButtonText}>Atualizar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fecharButton}
                onPress={() => { setModalPutVisivel(false); setErroMsg(""); setNome(""); setCpf(""); setEmail(""); setTelefone(""); setId(""); setData([]); }}
              >
                <Text style={styles.fecharButtonText}>Fechar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal POST */}
      <Modal
        visible={modalPost}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalPostVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalArea}>
            <ScrollView>
              <Text style={styles.modalTitulo}>Cadastrar Cliente</Text>
              <TextInput
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
                maxLength={90}
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="CPF"
                value={cpf}
                onChangeText={setCpf}
                maxLength={15}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                maxLength={64}
                keyboardType="email-address"
                style={styles.input}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Telefone"
                value={telefone}
                onChangeText={setTelefone}
                maxLength={30}
                keyboardType="phone-pad"
                style={styles.input}
                placeholderTextColor="#888"
              />
              {erroMsg ? <Text style={styles.erroMsg}>{erroMsg}</Text> : null}
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#FF9800" }]}
                onPress={validarCamposPost}
              >
                <Text style={styles.actionButtonText}>Cadastrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fecharButton}
                onPress={() => { setModalPostVisivel(false); setErroMsg(""); setNome(""); setCpf(""); setEmail(""); setTelefone(""); setData([]); }}
              >
                <Text style={styles.fecharButtonText}>Fechar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal DELETE */}
      <Modal
        visible={modalDelete}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalDeleteVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalArea}>
            <Text style={styles.modalTitulo}>Deletar Cliente</Text>
            <TextInput
              placeholder="ID do Cliente"
              value={id}
              onChangeText={setId}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#888"
            />
            {erroMsg ? <Text style={styles.erroMsg}>{erroMsg}</Text> : null}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#F44336" }]}
              onPress={validarCamposDelete}
            >
              <Text style={styles.actionButtonText}>Deletar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fecharButton}
              onPress={() => { setModalDeleteVisivel(false); setErroMsg(""); setId(""); setData([]); }}
            >
              <Text style={styles.fecharButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f0fe",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 30,
    letterSpacing: 1,
    textShadowColor: "#bbdefb",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  menuButton: {
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 22,
    marginHorizontal: 5,
    elevation: 4,
    shadowColor: "#222",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginBottom: 10,
  },
  menuButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(20, 20, 30, 0.90)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalArea: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    width: "90%",
    maxHeight: "90%",
    shadowColor: "#222",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 18,
    textAlign: "center",
    letterSpacing: 1.1,
  },
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: "center",
    minWidth: 120,
    elevation: 2,
    shadowColor: "#222",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  fecharButton: {
    backgroundColor: "#999",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignItems: "center",
    marginTop: 12,
    alignSelf: "center",
  },
  fecharButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  input: {
    backgroundColor: "#f1f8fe",
    borderRadius: 8,
    borderColor: "#bdbdbd",
    borderWidth: 1,
    paddingVertical: Platform.OS === "ios" ? 13 : 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 12,
    color: "#222",
    shadowColor: "#bbdefb",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  erroMsg: {
    color: "#F44336",
    fontSize: 15,
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  lista: {
    marginTop: 10,
    marginBottom: 12,
    maxHeight: 200,
  },
  cardCliente: {
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
    padding: 13,
    marginBottom: 12,
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#bbdefb",
  },
  cardLabel: {
    fontSize: 15,
    color: "#1976D2",
    marginBottom: 1,
    fontWeight: "bold",
  },
  cardId: {
    fontSize: 15,
    color: "#0d47a1",
    marginBottom: 2,
    fontWeight: "bold",
  },
  cardValue: {
    color: "#222",
    fontWeight: "400",
  },
})