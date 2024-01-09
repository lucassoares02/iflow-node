const connection = require("@server");
const logger = require("@logger");

const Project = {
  async createOne(req, res) {
    logger.info("Post Project");

    const { name } = req.body;

    console.log(name);

    try {
      // Iniciar transação
      await connection.query("BEGIN");

      // Inserir dados na tabela 'project'
      const projectQuery = "INSERT INTO project (name) VALUES ($1)";
      const projectValues = [name];
      await connection.query(projectQuery, projectValues);

      // Commit da transação
      await connection.query("COMMIT");
      res.status(200).send("Dados inseridos com sucesso!");
    } catch (error) {
      // Rollback da transação em caso de erro
      await connection.query("ROLLBACK");
      console.error(`Erro ao inserir valores: ${error}`);
      res.status(500).send("Erro ao inserir dados no banco de dados.");
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

  async create(req, res) {
    logger.info("Post Project");

    const params = req.body;

    const { project } = req.body;
    project.id = "1a2b3c0e9r8w";

    console.log(params);

    try {
      // Iniciar transação
      await connection.query("BEGIN");

      // Inserir dados na tabela 'project'
      const projectQuery = "INSERT INTO project (id, name) VALUES ($1, $2)";
      const projectValues = [project.id, project.title];
      await connection.query(projectQuery, projectValues);

      // Inserir dados na tabela 'item'
      for (const item of project.items) {
        const itemQuery = "INSERT INTO item (id, idproject, name, icon, description) VALUES ($1, $2, $3, $4, $5)";
        const itemValues = [item.id, project.id, item.name, item.icon, item.description];
        await connection.query(itemQuery, itemValues);
      }

      // Inserir dados na tabela 'view'
      for (const view of project.views) {
        const viewQuery = "INSERT INTO view (id, idproject, name) VALUES ($1, $2, $3)";
        const viewValues = [view.id, project.id, view.name];
        await connection.query(viewQuery, viewValues);

        // Inserir dados na tabela 'itemview'
        for (const itemView of view.items) {
          const itemViewQuery = "INSERT INTO itemview (id, idview, labelheight, tile) VALUES ($1, $2, $3, $4)";
          const itemViewValues = [itemView.id, view.id, itemView.labelheight, JSON.stringify(itemView.tile)];
          await connection.query(itemViewQuery, itemViewValues);
        }

        // Inserir dados na tabela 'connector'
        for (const connector of view.connectors) {
          const connectorQuery = "INSERT INTO connector (id, idview, color, width, description, style) VALUES ($1, $2, $3, $4, $5, $6)";
          const connectorValues = [connector.id, view.id, connector.color, connector.width, connector.description, connector.style];
          await connection.query(connectorQuery, connectorValues);

          // Inserir dados na tabela 'anchor'
          for (const anchor of connector.anchors) {
            const anchorQuery = "INSERT INTO anchor (id, idconnector, ref) VALUES ($1, $2, $3)";
            const anchorValues = [anchor.id, connector.id, JSON.stringify(anchor.ref)];
            await connection.query(anchorQuery, anchorValues);
          }
        }

        // Inserir dados na tabela 'rectangle'
        for (const rectangle of view.rectangles) {
          const rectangleQuery = "INSERT INTO rectangle (id, idview, color, tofrom, fromto) VALUES ($1, $2, $3, $4, $5)";
          const rectangleValues = [rectangle.id, view.id, rectangle.color, JSON.stringify(rectangle.from), JSON.stringify(rectangle.to)];
          await connection.query(rectangleQuery, rectangleValues);
        }

        // Inserir dados na tabela 'textbox'
        for (const textBox of view.textBoxes) {
          const textBoxQuery = "INSERT INTO textbox (id, idview, orientation, fontsize, content, tile) VALUES ($1, $2, $3, $4, $5, $6)";
          const textBoxValues = [textBox.id, view.id, textBox.orientation, textBox.fontsize, textBox.content, JSON.stringify(textBox.tile)];
          await connection.query(textBoxQuery, textBoxValues);
        }
      }

      // Commit da transação
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
    const projectId = params.id; // Id do projeto que você deseja atualizar
    const project = body;

    console.log(projectId);
    console.log(body);

    try {
      // Iniciar transação
      await connection.query("BEGIN");

      // Deletar dados antigos da tabela 'item'
      const deleteItemQuery = "DELETE FROM item WHERE idproject = $1";
      await connection.query(deleteItemQuery, [projectId]);

      // Inserir novos dados na tabela 'item'
      for (const item of project.items) {
        const itemQuery = "INSERT INTO item (id, idproject, name, icon, description) VALUES ($1, $2, $3, $4, $5)";
        const itemValues = [item.id, projectId, item.name, item.icon, item.description];
        await connection.query(itemQuery, itemValues);
      }

      // Deletar dados antigos e inserir novos dados nas tabelas 'view', 'itemview', 'connector', 'anchor', 'rectangle', 'textbox'
      for (const view of project.views) {
        // Consultas de exclusão para cada tabela associada
        const deleteViewQuery = "DELETE FROM view WHERE id = $1";
        await connection.query(deleteViewQuery, [view.id]);

        const deleteItemViewQuery = "DELETE FROM itemview WHERE idview = $1";
        await connection.query(deleteItemViewQuery, [view.id]);

        const deleteConnectorQuery = "DELETE FROM connector WHERE idview = $1";
        await connection.query(deleteConnectorQuery, [view.id]);

        const deleteAnchorQuery = "DELETE FROM anchor WHERE idconnector IN (SELECT id FROM connector WHERE idview = $1)";
        await connection.query(deleteAnchorQuery, [view.id]);

        const deleteRectangleQuery = "DELETE FROM rectangle WHERE idview = $1";
        await connection.query(deleteRectangleQuery, [view.id]);

        const deleteTextboxQuery = "DELETE FROM textbox WHERE idview = $1";
        await connection.query(deleteTextboxQuery, [view.id]);

        // Consultas de inserção para cada tabela associada
        const viewQuery = "INSERT INTO view (id, idproject, name) VALUES ($1, $2, $3)";
        const viewValues = [view.id, projectId, view.name];
        await connection.query(viewQuery, viewValues);

        for (const itemView of view.items) {
          const itemViewQuery = "INSERT INTO itemview (id, idview, labelheight, tile) VALUES ($1, $2, $3, $4)";
          const itemViewValues = [itemView.id, view.id, itemView.labelheight, JSON.stringify(itemView.tile)];
          await connection.query(itemViewQuery, itemViewValues);
        }

        for (const connector of view.connectors) {
          const connectorQuery = "INSERT INTO connector (id, idview, color, width, description, style) VALUES ($1, $2, $3, $4, $5, $6)";
          const connectorValues = [connector.id, view.id, connector.color, connector.width, connector.description, connector.style];
          await connection.query(connectorQuery, connectorValues);

          for (const anchor of connector.anchors) {
            const anchorQuery = "INSERT INTO anchor (id, idconnector, ref) VALUES ($1, $2, $3)";
            const anchorValues = [anchor.id, connector.id, JSON.stringify(anchor.ref)];
            await connection.query(anchorQuery, anchorValues);
          }
        }

        for (const rectangle of view.rectangles) {
          const rectangleQuery = "INSERT INTO rectangle (id, idview, color, tofrom, fromto) VALUES ($1, $2, $3, $4, $5)";
          const rectangleValues = [rectangle.id, view.id, rectangle.color, JSON.stringify(rectangle.from), JSON.stringify(rectangle.to)];
          await connection.query(rectangleQuery, rectangleValues);
        }

        for (const textBox of view.textBoxes) {
          const textBoxQuery = "INSERT INTO textbox (id, idview, orientation, fontsize, content, tile) VALUES ($1, $2, $3, $4, $5, $6)";
          const textBoxValues = [textBox.id, view.id, textBox.orientation, textBox.fontsize, textBox.content, JSON.stringify(textBox.tile)];
          await connection.query(textBoxQuery, textBoxValues);
        }
      }

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

  async find(req, res) {
    const { id } = req.params;

    try {
      // Consultar dados da tabela 'project'
      const resultProject = await connection.query("SELECT * FROM project where id = $1", [id]);
      const project = resultProject.rows[0];

      // Consultar dados da tabela 'item'
      const resultItems = await connection.query("SELECT * FROM item WHERE idproject = $1", [id]);
      const items = resultItems.rows;

      // Consultar dados da tabela 'view'
      const resultViews = await connection.query("SELECT * FROM view WHERE idproject = $1", [id]);
      const views = resultViews.rows;

      // Montar o objeto
      const objetoMontado = {
        title: project.name,
        id: project.id,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          icon: item.icon,
          description: item.description,
        })),
        views: await Promise.all(
          views.map(async (view) => {
            // Consultar dados das tabelas relacionadas a 'view'
            const resultItemsView = await connection.query("SELECT * FROM itemview WHERE idview = $1", [view.id]);
            const itemsView = resultItemsView.rows;

            const resultConnectors = await connection.query("SELECT * FROM connector WHERE idview = $1", [view.id]);
            const connectors = resultConnectors.rows;

            const anchorsPromises = connectors.map(async (connector, index) => {
              const resultAnchors = await connection.query("SELECT id, ref::json FROM anchor WHERE idconnector = $1", [connector.id]);
              connector.anchors = resultAnchors.rows;

              connectors[index] = connector;
              return resultAnchors.rows;
            });

            const resultRectangles = await connection.query("SELECT * FROM rectangle WHERE idview = $1", [view.id]);
            const rectangles = resultRectangles.rows;

            const resultTextBoxes = await connection.query("SELECT * FROM textbox WHERE idview = $1", [view.id]);
            const textBoxes = resultTextBoxes.rows;

            return {
              id: view.id,
              name: view.name,
              items: itemsView.map((itemView) => ({
                id: itemView.id,
                idview: itemView.idview,
                labelheight: itemView.labelheight,
                tile: JSON.parse(itemView.tile),
              })),
              connectors: connectors,
              // connectors: connectors.map((connector) => ({
              //   id: connector.id,
              //   idview: connector.idview,
              //   color: connector.color,
              //   width: connector.width,
              //   style: connector.style,
              //   description: connector.description,
              //   anchors: async () => await Promise.all(await connection.query("SELECT * FROM anchor WHERE idconnnector = $1", [connector.id]).rows),
              //   // anchors: [], // Adicione a lógica para consultar dados das tabelas relacionadas a 'anchor'
              // })),
              rectangles: rectangles.map((rectangle) => ({
                id: rectangle.id,
                idview: rectangle.idview,
                color: rectangle.color,
                from: JSON.parse(rectangle.tofrom),
                to: JSON.parse(rectangle.fromto),
              })),
              textBoxes: textBoxes.map((textBox) => ({
                id: textBox.id,
                idview: textBox.idview,
                orientation: textBox.orientation,
                fontsize: textBox.fontsize,
                content: textBox.content,
                tile: JSON.parse(textBox.tile),
              })),
            };
          })
        ),
      };

      res.json(objetoMontado);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao consultar dados do banco de dados.");
    }
  },

  async findAll(req, res) {
    const resultProjects = await connection.query("SELECT * FROM project");
    const projects = resultProjects.rows;
    res.json(projects);
  },
};

module.exports = Project;
