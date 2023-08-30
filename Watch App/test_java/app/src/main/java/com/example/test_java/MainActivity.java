package com.example.test_java;

import android.app.Activity;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;
import android.support.wearable.view.WatchViewStub;

import static com.google.android.gms.wearable.DataMap.TAG;

import static java.security.AccessController.getContext;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

import android.provider.Settings.Secure;

import java.util.Random;
import java.util.UUID;

public class MainActivity extends Activity {
    private SensorManager sensorManager;
    private Sensor heartRateSensor;
    private TextView textView;
    private int heartBeat1 ;
    private int oldheartBeat1;
    private int heartBeat2 ;
    private int oldheartBeat2;
    private String ts = "";
    private String postData = "";
    private String sendUrl = "http://43.252.167.19:9527/api/getdata";
    //private String sendUrl = "http://192.168.56.70:8000/api/getdata";
    private RequestQueue requestQuene;

    Random r = new Random();

    private String uniqueID1 = UUID.randomUUID().toString();

    private String uniqueID2 = UUID.randomUUID().toString();
    int sucess;

//    Switch dtmode = (Switch) findViewById(R.id.DTswitch);


    private String T_Sucess = "success";
    private String T_Message = "message";
    private String T_json_obj = "json_obj_req";
    private static final String TAG = MainActivity.class.getSimpleName();
    private SensorEventListener sensorEventListener = new SensorEventListener() {
        @Override
        public void onSensorChanged(SensorEvent event) {
            textView = (TextView) findViewById(R.id.b);
            if (event.sensor.getType() == Sensor.TYPE_HEART_RATE) {
                String msg = "" + (float)event.values[0];
                heartBeat1 = (int)event.values[0];
                textView.setText(msg);
                sendData();
                Log.d(TAG, msg);
            }
            else {
                textView = (TextView) findViewById(R.id.b);
                Log.d(TAG, "Unknown sensor type");
                String msg = "unknown";
                textView.setText(msg);
            }
            if (((Switch) findViewById(R.id.duouser)).isChecked()){
                heartBeat2 = r.nextInt(45) + 55;
            }
        }

        @Override
        public void onAccuracyChanged(Sensor sensor, int accuracy) {

        }
    };
//    WatchViewStub



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Keep the screen on
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        textView = (TextView) findViewById(R.id.a);
        requestQuene = Volley.newRequestQueue(getApplicationContext());
        sensorManager = ((SensorManager) getSystemService(Context.SENSOR_SERVICE));
        heartRateSensor = sensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE);
        sensorManager.registerListener(sensorEventListener, heartRateSensor, SensorManager.SENSOR_DELAY_FASTEST);
        Log.i(TAG, "LISTENER REGISTERED.");
        textView.setText("Heart Rate");
        textView = (TextView) findViewById(R.id.b);
        textView.setText("Detecting...");
        textView = (TextView) findViewById(R.id.DTswitch);
        textView.setText("Data Transfer");
//        dtmode = (Switch) findViewById(R.id.DTswitch);


        sensorManager.registerListener(sensorEventListener, heartRateSensor, sensorManager.SENSOR_DELAY_FASTEST);

        oldheartBeat1 = 0;
        oldheartBeat2 = 0;

    }
    public void onResume(){
        super.onResume();
    }
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        Log.d(TAG, "onAccuracyChanged - accuracy: " + accuracy);
    }

    private void sendData(){
        if (!((Switch) findViewById(R.id.DTswitch)).isChecked())return;
        StringRequest request = new StringRequest(Request.Method.POST, sendUrl, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    sucess = jsonObject.getInt(T_Sucess);
                    if (sucess == 1) {
//                        Toast.makeText(MainActivity.this, jsonObject.getString(T_Message), Toast.LENGTH_SHORT).show();
                    } else {
//                        Toast.makeText(MainActivity.this, jsonObject.getString(T_Message), Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
//                    Toast.makeText(MainActivity.this, "" + e, Toast.LENGTH_SHORT).show();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
//                Toast.makeText(MainActivity.this, error.getMessage().toString(), Toast.LENGTH_SHORT).show();
            }
        }){
            @Override
            public String getBodyContentType() {
                return "application/x-www-form-urlencoded; charset=UTF-8";
            }

            @Override
            public byte[] getBody() {
                Long tsLong = System.currentTimeMillis()/1000;
                ts = tsLong.toString();
                if (((Switch) findViewById(R.id.duouser)).isChecked()) {
                    postData = "state=duo"+"&timestamp1=" + ts + "&heartBeat1=" + heartBeat1 + "&UUID1=" + uniqueID1
                            + "&timestamp2=" + ts + "&heartBeat2=" + heartBeat2 + "&UUID2=" + uniqueID2;
                }
                else postData = "state=sin"+"&timestamp1=" + ts + "&heartBeat1=" + heartBeat1 + "&UUID1=" + uniqueID1;
                textView = (TextView) findViewById(R.id.a);
                textView.setText(postData);
                return postData.getBytes();
            }
        };

        request.setRetryPolicy(new DefaultRetryPolicy(1000,1,1.0f));
        
        //logic to determine to upload or not when the heartbeat remains the same
/*
        if (((Switch) findViewById(R.id.duouser)).isChecked()) {
            if(heartBeat1!=oldheartBeat1||heartBeat2!=oldheartBeat2) {
                requestQuene.add(request);
                oldheartBeat1 = heartBeat1;
                oldheartBeat2 = heartBeat2;
            }
        } else {
            if(heartBeat1!=oldheartBeat1) {
                requestQuene.add(request);
                oldheartBeat1 = heartBeat1;
            }
        }
*/
        requestQuene.add(request);

    }



}
