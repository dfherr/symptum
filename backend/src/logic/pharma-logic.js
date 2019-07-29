// custom dependencies
const logger = require('../../logger');
const DbHandler = require('./../database/DbHandler');

/**
 * Start an advertisement campaign.
 *
 * @param {object} req
 * @param {object} res
 */
function startAdCampaign(req, res) {
    logger.verbose('Start advertisement campaign functionality triggered');

    const campaign = req.body;
    const dbHandler = new DbHandler();
    logger.info(`POST ad campaign for drugId: ${campaign.drugId}`);

    // extract my marketerId from the user object set by passport
    campaign.userId = req.user.id;

    // insert the campaign to the database
    dbHandler.create('advertisementCampaigns', campaign)
        // send a response object containing the createdCampaign
        .then(createdCampaign => res.send({
            success: true,
            message: 'The created ad campaign',
            data: createdCampaign,
            status: 200,
        }))
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.startAdCampaign = startAdCampaign;

/**
 * Get an advertisement campaign.
 *
 * @param {object} req
 * @param {object} res
 */
function getAdCampaign(req, res) {
    logger.verbose('Get advertisement campaign functionality triggered');

    const { campaignId } = req.params;
    const dbHandler = new DbHandler();
    logger.info(`GET ad campaign for id: ${campaignId}`);

    // the db query condition
    const condition = {
        where: {
            id: campaignId,
        },
    };

    // get the campaign from the database
    dbHandler.findOne('advertisementCampaigns', condition)
        // send a response object containing the campaign
        .then(campaign => res.send({
            success: true,
            message: `Found campaign with id: ${campaignId}`,
            data: campaign.dataValues,
            status: 200,
        }))
        // send an error response object
        .catch(err => res.status(500).send({
            success: false,
            message: err,
            status: 500,
        }));
}

exports.getAdCampaign = getAdCampaign;
