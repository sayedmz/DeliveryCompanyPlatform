<?php

namespace App\Models;

use Illuminate\Contracts\Concurrency\Driver;
use Illuminate\Database\Eloquent\Model;


class Orders extends Model
{
    protected $table = 'orders' ; 
    protected $primaryKey = 'orderID';
    public $timestamps = true;
       protected $fillable = [
        'driverId',
        'orderName',
        'orderAddress',
        'customerName',
        'customerPhone',
        'totalPrice',
        'deliveryPrice',
        'status',
        'currency',
    ];
    //    public function driver()
    // {
    //     return $this->belongsTo(Driver::class, 'driverId', 'driverId');
    // }
    public function driver()
    {
        // orders.driverId -> users.userID
        return $this->belongsTo(User::class, 'driverId', 'userID');
    }

}
