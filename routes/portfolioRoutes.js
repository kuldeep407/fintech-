import express from 'express'
import { addPortfolio, filterPortfolioData, getPortfolio } from '../controllers/portfolioContoller.js'

const router = express.Router()

router.route('/add-portfolio').post(addPortfolio)
router.route('/get-portfolio').get(getPortfolio)
router.route('/filter-portfolio-data').get(filterPortfolioData)



export default router

