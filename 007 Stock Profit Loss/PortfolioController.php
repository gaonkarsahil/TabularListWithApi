<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AaPortfolioController extends ApiController
{
    /**
     * The request instance.
     *
     * @var \Illuminate\Http\Request
     */
    public $request;
    /**
     * Create a new controller instance.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function index()
    {
        // $a = DB::table('vendor_purchase')->get(['stock_id', 'stock_name',	'unit_amount', 'total_quantity']);
        $a = DB::table('vendor_purchase')->where('status',1)->get();
// dd($a);
        // $r = [
        //     "headers" => [
        //         "User ID",
        //         "Name",
        //         "Occupation",
        //         "Age"
        //     ],
        //     "rows" => [
        //         [
        //             200012,
        //             "Dom",
        //             "Web Developer",
        //             34
        //         ],
        //         [
        //             200013,
        //             "Sam",
        //             "Web Designer",
        //             34
        //         ]
        //     ]
        // ];

        $r = [
            "headers" => [
                "ID",
                "Stock ID",
                "Stock Name",	
                "Unit Amount",	
                "Total Quantity",
                "Excise Tax",
                "Subtotal",
                "Total Tax",
                "Total Amount",
                "Is Sold",	
                // "Status",
                // "Order Date Time",
                // "createdAt",	
                // "updatedAt",
                "Action"
            ],
            "rows" => json_encode($a)
            
        ];

        return response($r, Response::HTTP_OK);

    }

    public function add()
    {
        $this->validate($this->request, [
            'stock_id' => 'required|numeric|min:0',
            'stock_name' => 'required|string|max:150',
            'unit_amount' => 'required|numeric|min:0',
            'total_quantity' => 'required|numeric|min:1',
            'order_date_time' => 'required|date',
            'is_sold' => 'required|numeric'
        ]);


        $processedData = $this->request->only(['stock_id','stock_name','unit_amount','total_quantity','order_date_time','is_sold']);
        $processedData['excise_tax'] = 2;
        $processedData['subtotal'] = $processedData['unit_amount'] * $processedData['total_quantity'];
        $processedData['total_tax'] = $processedData['subtotal'] * $processedData['excise_tax'] / 100;
        $processedData['total_amount'] = $processedData['subtotal'] + $processedData['total_tax'];
        $processedData['status'] = 1;
        $processedData['createdAt'] = Carbon::now()->toDateTimeString();

        $a = DB::table('vendor_purchase')->insertGetId($processedData);
        // dd($a);
        $response = ["status" => true, "data" => $a, "message" => "Order with ID = ".$a." is created"];

        return response($response, Response::HTTP_OK);

    }

    public function edit()
    {
        $this->validate($this->request, [
            'stock_id' => 'sometimes|numeric|min:0',
            'stock_name' => 'sometimes|string|max:150',
            'unit_amount' => 'sometimes|numeric|min:0',
            'total_quantity' => 'sometimes|numeric|min:1',
            'order_date_time' => 'sometimes|date',
            'is_sold' => 'sometimes|numeric'
        ]);

        $processedData = $this->request->only(['stock_id','stock_name','unit_amount','total_quantity','order_date_time','is_sold']);
        $processedData['excise_tax'] = 0;
        $processedData['subtotal'] = $processedData['unit_amount'] * $processedData['total_quantity'];
        $processedData['total_tax'] = $processedData['subtotal'] * $processedData['excise_tax'] / 100;
        $processedData['total_amount'] = $processedData['subtotal'] + $processedData['total_tax'];
        $processedData['status'] = 1;
        $processedData['updatedAt'] = Carbon::now()->toDateTimeString();

        $a = DB::table('vendor_purchase')->where('id',$this->request->id)->update($processedData);

        $response = ["status" => true, "data" => $this->request->id, "message" => "Order with ID = ".$this->request->id." is updated"];

        return response($response, Response::HTTP_OK);

    }


    public function fetchOrder($id)
    {
        $a = DB::table('vendor_purchase')->where('id',$id)->where('status',1)->first();

        $r =(object) (array("data" => $a));

        return response(json_encode($r), Response::HTTP_OK);
    }

    public function delete()
    {
        $a = DB::table('vendor_purchase')->where('id',$this->request->id)->where('status',1)->first();

        if(empty($a)) {
            $response = ["status" => false, "message" => "Order with ID = ".$this->request->id." not found"];
            return response($response, Response::HTTP_OK);
        }

        $processedData['status'] = 0;
        $processedData['updatedAt'] = Carbon::now()->toDateTimeString();

        $a = DB::table('vendor_purchase')->where('id',$this->request->id)->update($processedData);

        $response = ["status" => true, "message" => "Order with ID = ".$this->request->id." is deleted"];

        return response($response, Response::HTTP_OK);

    }

    public function plIndex()
    {
        $a = DB::select(DB::raw("SELECT vp.stock_id,vp.stock_name,
        SUM(CASE WHEN is_sold = 0 THEN vp.total_quantity ELSE 0 END) AS total_quantity,
        SUM(CASE WHEN is_sold = 1 THEN vp.total_quantity ELSE 0 END) AS sold_quantity,
        SUM(CASE WHEN is_sold = 0 THEN vp.total_quantity ELSE - vp.total_quantity END) AS holding_quantity,	
        SUM(CASE WHEN is_sold = 0 THEN vp.total_amount ELSE 0 END) AS total_buy_amount,
        SUM(CASE WHEN is_sold = 1 THEN vp.total_amount ELSE 0 END) AS total_sell_amount,
        SUM(CASE WHEN is_sold = 0 THEN vp.total_amount ELSE - vp.total_amount END) AS holding_amount,
        SUM(CASE WHEN is_sold = 0 THEN vp.total_amount ELSE - vp.total_amount END) / SUM(CASE WHEN is_sold = 0 THEN vp.total_quantity ELSE - vp.total_quantity END)  AS unit_hold_amount,
        m.livePriceDtoopen as open,
        m.livePriceDtoclose as close,
        (SUM(CASE WHEN is_sold = 0 THEN vp.total_quantity ELSE 0 END) * m.livePriceDtoopen ) -(SUM(CASE WHEN is_sold = 0 THEN vp.total_quantity ELSE 0 END) * SUM(CASE WHEN is_sold = 0 THEN vp.total_amount ELSE - vp.total_amount END) / SUM(CASE WHEN is_sold = 0 THEN vp.total_quantity ELSE - vp.total_quantity END) )
           AS pl_amount,
        ((SUM(CASE WHEN is_sold = 0 THEN vp.total_quantity ELSE 0 END) * m.livePriceDtoopen ) -(SUM(CASE WHEN is_sold = 0 THEN vp.total_quantity ELSE 0 END) * SUM(CASE WHEN is_sold = 0 THEN vp.total_amount ELSE - vp.total_amount END) / SUM(CASE WHEN is_sold = 0 THEN vp.total_quantity ELSE - vp.total_quantity END) ))
         / m.livePriceDtoclose AS free_stock
        
        FROM `vendor_purchase` as vp
        inner join mytable as m
        on vp.stock_id = m.id
        where m.id = 186
        group by stock_id
        order by order_date_time desc
         "));

        // $r = [
        //     "headers" => [
        //         "User ID",
        //         "Name",
        //         "Occupation",
        //         "Age"
        //     ],
        //     "rows" => [
        //         [
        //             200012,
        //             "Dom",
        //             "Web Developer",
        //             34
        //         ],
        //         [
        //             200013,
        //             "Sam",
        //             "Web Designer",
        //             34
        //         ]
        //     ]
        // ];

        $r = [
            "headers" => [
                // "ID",
                "Stock ID",
                "Stock Name",	
                "Total Quantity",	
                "Sold Quantity",
                "Holding Quantity",
                "Total Buy Amount",
                "Total Sell Amount",
                "Holding Amount",
                "Unit Hold Amount",
                "open",
                "close",
                "PL Amount",
                "Free Stock"			
            ],
            "rows" => json_encode($a)
            
        ];

        return response($r, Response::HTTP_OK);

    }

}
