const connection = require("@server");
const logger = require("@logger");

const Project = {
  async findAll(req, res) {
    console.log("Find All Projects");
    const resultProjects = await connection.query("SELECT * FROM project");
    const projects = resultProjects.rows;
    res.json(projects);
  },

  async find(req, res) {
    console.log("Find One Project");
    const { id } = req.params;

    try {
      // Consultar dados da tabela 'project'
      const resultProject = await connection.query("SELECT * FROM project where id = $1", [id]);
      const projects = resultProject.rows[0];
      const objetoMontado = { id: projects.id, content: JSON.parse(projects.content) };
      console.log(projects);

      res.json(objetoMontado);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao consultar dados do banco de dados.");
    }
  },

  async createOne(req, res) {
    logger.info("Post Project");

    const data = req.body;

    try {
      // Iniciar transação
      await connection.query("BEGIN");

      // Inserir dados na tabela 'project'
      const projectQuery = "INSERT INTO project (name, content) VALUES ($1, $2)";
      const projectValues = [data.title, data];
      await connection.query(projectQuery, projectValues);

      await connection.query("COMMIT");
      res.status(200).send("Dados inseridos com sucesso!");
    } catch (error) {
      // Rollback da transação em caso de erro
      await connection.query("ROLLBACK");
      console.error(`Erro ao inserir valores: ${error}`);
      res.status(500).send("Erro ao inserir dados no banco de dados.");
    }
  },

  async update(req, res) {
    logger.info("Update Project");

    const { params, body } = req;
    const id = params.id; // Id do projeto que você deseja atualizar
    const name = body.title;

    console.log(name);
    console.log(name);

    try {
      // Iniciar transação
      await connection.query("BEGIN");

      // Deletar dados antigos da tabela 'item'
      const updateItemQuery = "update project set name = $1, content = $2 where id = $3";
      const projectValues = [name, body, id];
      await connection.query(updateItemQuery, projectValues);

      // Commit da transação
      await connection.query("COMMIT");
      res.status(200).send("Dados atualizados com sucesso!");
    } catch (error) {
      // Rollback da transação em caso de erro
      await connection.query("ROLLBACK");
      console.error(`Erro ao atualizar valores: ${error}`);
      res.status(500).send("Erro ao atualizar dados no banco de dados.");
    }
  },

  async delete(req, res) {
    logger.info("Delete Project");

    const { id } = req.params;

    console.log(id);

    try {
      // Iniciar transação
      await connection.query("BEGIN");

      // Inserir dados na tabela 'project'
      const projectQuery = "DELETE FROM project where id = ($1)";
      const projectValues = [id];
      await connection.query(projectQuery, projectValues);

      // Commit da transação
      await connection.query("COMMIT");
      res.status(200).send("Dados deletados com sucesso!");
    } catch (error) {
      // Rollback da transação em caso de erro
      await connection.query("ROLLBACK");
      console.error(`Erro ao deletar valores: ${error}`);
      res.status(500).send("Erro ao deletar dados no banco de dados.");
    }
  },
};

module.exports = Project;
