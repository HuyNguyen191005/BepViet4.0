<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('favorites', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id');
        $table->unsignedBigInteger('recipe_id');
        $table->timestamps();

        // Khóa ngoại (để ràng buộc dữ liệu)
        $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        $table->foreign('recipe_id')->references('recipe_id')->on('recipes')->onDelete('cascade');

        // Đảm bảo 1 người không like 1 món 2 lần
        $table->unique(['user_id', 'recipe_id']);
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('favorites');
    }
};
