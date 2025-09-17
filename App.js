import { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';

export default function App() {

  const [modalGet, setModalGetVisivel] = useState(false)
  const [modalPut, setModalPutVisivel] = useState(false)
  const [modalPost, setModalPostVisivel] = useState(false)
  const [modalDelete, setModalDeleteVisivel] = useState(false)

  const [data, setData] = useState([])

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

  const metodoGetId = async () => {
    try {
      const response = await fetch(`${URL_API}/clientes/${id}`)
      const dadosBD = await response.json()
      setData([dadosBD])
    } catch (error) {
      setErroMsg("Erro ao buscar dados do cliente")
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

  const renderizarItem = ({ item }) => (
    <View>
      <Text>{item.id} - {item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      <View>

        <TouchableOpacity onPress={() => setModalGetVisivel(true)}>
          <Text>GET</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalPutVisivel(true)}>
          <Text>PUT</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalPostVisivel(true)}>
          <Text>POST</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalDeleteVisivel(true)}>
          <Text>DELETE</Text>
        </TouchableOpacity>

      </View>


      {/* Get */}
      <Modal
        visible={modalGet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalGetVisivel(false)}
      >
        <View>
          <FlatList
            data={[
              { id: 1, title: 'Item 1' },
              { id: 2, title: 'Item 2' },
              { id: 3, title: 'Item 3' },
              { id: 4, title: 'Item 4' },
              { id: 5, title: 'Item 5' },
            ]}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderizarItem}
          />
        </View>
      </Modal>

      {/* Put */}
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

      {/* Post */}
      <Modal
        visible={modalPost}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalPostVisivel(false)}
      >

      </Modal>

      {/* Delete */}
      <Modal
        visible={modalDelete}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalDeleteVisivel(false)}
      >

      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
