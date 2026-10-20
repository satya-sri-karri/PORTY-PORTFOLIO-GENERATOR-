async function disclose(page, text) {
  const summary = page.locator('summary').filter({hasText:text}).first();
  if (!(await summary.evaluate(node => node.parentElement.open))) await summary.click();
}
async function savePortfolio(page) {
  const edit = page.getByRole('button',{name:'Edit details',exact:true});
  if (await edit.isVisible()) await edit.click();
  await page.getByRole('button',{name:'Review & save',exact:true}).click();
  await page.locator('.builder-footer').getByRole('button',{name:/Save private portfolio|Save public changes|Publish portfolio/}).click();
}
module.exports = {disclose,savePortfolio};
