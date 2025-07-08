const express = require("express");
const mongoose = require("mongoose");
const {initializeDatabase} = require("./db/db.connect");
const Recipe = require("./models/recipe.models");
const app = express();
initializeDatabase();

app.use(express.json());

async function createRecipe(newRecipe){
    try{
        const recipe = new Recipe(newRecipe);
        const saveRecipe = await recipe.save();
        return saveRecipe;
    } catch(error){
        throw error
    }
}

app.post("/recipes", async (req, res) => {
    try{
        const savedRecipe = await createRecipe(req.body);
        res.status(201).json({message: "Recipe added successfully.", newRecipe: savedRecipe});
    } catch(error){
        res.status(500).json({error: "Failed to add recipe."});
    }
});

async function readAllRecipes(){
    try{
        const allRecipe = await Recipe.find();
        return allRecipe;
    } catch(error){
        console.log(error);
    }
}

app.get("/recipes", async (req, res) => {
    try{
        const recipes = await readAllRecipes();
        if(recipes.length != 0){
            res.json(recipes);
        } else{
            res.status(404).json({error: "Recipes not found."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch recipes."});
    }
});

async function readRecipeByTitle(recipeTitle){
    try{
        const recipe = await Recipe.findOne({title: recipeTitle});
        return recipe;
    } catch(error){
       throw error
    }
}

app.get("/recipes/:recipeTitle", async (req, res) => {
    try{
        const recipe = await readRecipeByTitle(req.params.recipeTitle);
        if(recipe){
            res.json(recipe);
        } else{
            res.status(404).json({error: "Recipe not found."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch recipe."});
    }
});

async function readRecipesByAuthor(authorName){
    try{
        const recipes = await Recipe.find({author: authorName});
        return recipes;
    } catch(error){
        throw error
    }
}

app.get("/recipes/author/:authorName", async (req, res) => {
    try{
        const recipes = await readRecipesByAuthor(req.params.authorName);
        if(recipes.length != 0){
            res.json(recipes);
        } else{
            res.status(404).json({error: "Recipes not found."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch recipes."});
    }
});

async function readRecipesByLevel(level){
    try{
        const recipes = await Recipe.find({difficulty: level});
        return recipes;
    } catch(error){
        throw error
    }
}

app.get("/recipes/levels/:level", async (req, res) => {
    try{
        const recipes = await readRecipesByLevel(req.params.level);
        if(recipes.length != 0){
            res.json(recipes);
        } else{
            res.status(404).json({error: "Recipes not found."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch recipes."});
    }
});

async function updateDifficultyById(recipeId, dataToUpdate){
    try{
        const updateRecipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {new: true});
        return updateRecipe;
    } catch(error){
        throw error
    }
}

app.post("/recipes/difficultyLevel/:recipeId", async (req, res) => {
    try{
        const updatedRecipe = await updateDifficultyById(req.params.recipeId, req.body);
        if(updatedRecipe){
            res.status(200).json({message: "Recipe updated successfully.", updatedRecipe: updatedRecipe});
        } else{
            res.status(404).json({error: "Recipe not found."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch recipe."});
    }
});

async function updateRecipeByTitle(recipeTitle, dataToUpdate){
    try{
        const updateRecipe = await Recipe.findOneAndUpdate({title: recipeTitle}, dataToUpdate, {new: true});
        return updateRecipe;
    } catch(error){
        throw error
    }
}

app.post("/recipes/update/:recipeTitle", async (req, res) => {
    try{
        const updatedRecipe = await updateRecipeByTitle(req.params.recipeTitle, req.body);
        if(updatedRecipe){
            res.status(200).json({message: "Recipe updated successfully.", updatedRecipe: updatedRecipe});
        } else{
            res.status(404).json({error: "Recipe not found."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch recipe."});
    }
});

async function deleteRecipeById(recipeId){
    try{
        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        return null;
    }
        const deleteRecipe = await Recipe.findByIdAndDelete(recipeId);
        return deleteRecipe;
    } catch(error){
        throw error
    }
}

app.delete("/recipes/deletion/:recipeId", async (req, res) => {
    try{
        const deletedRecipe = await deleteRecipeById(req.params.recipeId);
        if(deletedRecipe){
            res.status(200).json({message: "Recipe deleted successfully."});
        } else{
            res.status(404).json({error: "Recipe not found."});
        }
    } catch(error){
        res.status(500).json({error: "Failed to delete recipe."});
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});