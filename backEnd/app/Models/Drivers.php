<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Drivers extends Model
{
   use HasFactory;
   protected $table = 'drivers';
    protected $primaryKey = 'driverId';
    public $timestamps = true;

  public function orders()
    {
        return $this->hasMany(Orders::class, 'driverId', 'driverId');
    }
}
