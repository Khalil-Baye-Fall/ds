package com.example.childcarejava;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.location.Location;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;

import com.google.android.gms.common.api.ResolvableApiException;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResponse;
import com.google.android.gms.location.SettingsClient;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.snackbar.Snackbar;

import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.JsonReader;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.UnknownServiceException;
import java.util.Locale;

import javax.net.ssl.HttpsURLConnection;

import static android.util.JsonToken.END_DOCUMENT;
import static android.util.JsonToken.NUMBER;
import static android.util.JsonToken.STRING;
import static com.google.android.gms.common.api.CommonStatusCodes.SIGN_IN_REQUIRED;


public class MainActivity extends AppCompatActivity {

    private static final String TAG = MainActivity.class.getSimpleName();

    private static final int REQUEST_PERMISSIONS_REQUEST_CODE = 34;

    private int waitingTime = 2000; // 10sec wait
    private boolean shouldRepeat = true;

    /**
     * Provides the entry point to the Fused Location Provider API.
     */
    private FusedLocationProviderClient mFusedLocationClient;

    /**
     * Represents a geographical location.
     */
    protected Location mCurrentLocation;
    protected LocationCallback locationCallback;
    protected LocationRequest locationRequest;

    private String mLatitudeLabel;
    private String mLongitudeLabel;
    private TextView mLatitudeText;
    private TextView mLongitudeText;
    private TextView mTimerText;
    private TextView mPairingText;
    private TextView mPairingDeviceText;

    protected String RESTresponse;
    protected String deviceID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mLatitudeLabel = getResources().getString(R.string.latitude_label);
        mLongitudeLabel = getResources().getString(R.string.longitude_label);
        mLatitudeText = (TextView) findViewById((R.id.latitude_text));
        mLongitudeText = (TextView) findViewById((R.id.longitude_text));
        mTimerText = (TextView) findViewById(R.id.timer_text);
        mPairingText = (TextView) findViewById((R.id.pairing_text));
        mPairingDeviceText = (TextView) findViewById((R.id.pairingDevice_text));

        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult == null) {
                    return;
                }
                mCurrentLocation = locationResult.getLastLocation();
                getLastLocation();
//                for (Location location : locationResult.getLocations()) {
//                    mLatitudeText.setText(String.format(Locale.ENGLISH, "%s: %f",
//                            mLatitudeLabel,
//                            location.getLatitude()));
//                    mLongitudeText.setText(String.format(Locale.ENGLISH, "%s: %f",
//                            mLongitudeLabel,
//                            location.getLongitude()));
//                }
            }
        };

        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder();
        SettingsClient client = LocationServices.getSettingsClient(this);
        Task<LocationSettingsResponse> task = client.checkLocationSettings(builder.build());
        task.addOnSuccessListener(this, new OnSuccessListener<LocationSettingsResponse>() {
            @Override
            public void onSuccess(LocationSettingsResponse locationSettingsResponse) {
                // All location settings are satisfied. The client can initialize
                // location requests here.
                locationRequest = createLocationRequest(waitingTime);
                builder.addLocationRequest(locationRequest);
            }
        });

        task.addOnFailureListener(this, new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                if (e instanceof ResolvableApiException) {
                    // Location settings are not satisfied, but this can be fixed
                    // by showing the user a dialog.
                    try {
                        // Show the dialog by calling startResolutionForResult(),
                        // and check the result in onActivityResult().
                        ResolvableApiException resolvable = (ResolvableApiException) e;
                        resolvable.startResolutionForResult(MainActivity.this, SIGN_IN_REQUIRED);
                    } catch (IntentSender.SendIntentException sendEx) {
                        // Ignore the error.
                    }
                }
            }
        });



    }

    @Override
    public void onStart() {
        super.onStart();

        if (!checkPermissions()) {
            requestPermissions();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (checkPermissions()) {
            getLastLocation();
        }


        // pairing the device
        Thread urlThread1 = new Thread(new Runnable() {

            public void run() {
                // Create URL
                URL childCareEndpoint = null;
                HttpURLConnection myConnection = null;
                try {
                    childCareEndpoint = new URL("http://ec2-3-15-216-171.us-east-2.compute.amazonaws.com:3000/pairing");
                    myConnection = (HttpURLConnection) childCareEndpoint.openConnection();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                // Create connection
                try {
                    InputStream response = myConnection.getInputStream();
                    InputStreamReader responseReader = new InputStreamReader(response, "UTF-8");
                    JsonReader jsonReader = new JsonReader(responseReader);
                    jsonReader.setLenient(true);

//                    jsonReader.beginArray(); // Start processing the JSON object
                    String i = "";
                    while (jsonReader.peek() != END_DOCUMENT) { // Loop through all keys
                        if (jsonReader.peek() == NUMBER)
                            RESTresponse = ""+jsonReader.nextLong();
                    }
                    jsonReader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                myConnection.disconnect();
            }
        });
        // position from mobile
//        Thread urlThread2 = new Thread(new Runnable() {
//
//            public void run() {
//                while(deviceID != null){
//                    // Create URL
//                    URL childCareEndpoint = null;
//                    HttpURLConnection myConnection = null;
//                    try {
//                        childCareEndpoint = new URL("http://ec2-3-15-216-171.us-east-2.compute.amazonaws.com:3000/device/"+deviceID+"/rules");
//                        myConnection = (HttpURLConnection) childCareEndpoint.openConnection();
//                    } catch (IOException e) {
//                        e.printStackTrace();
//                    }
//
//                    // Create connection
//                    try {
//                        InputStream response = myConnection.getInputStream();
//                        InputStreamReader responseReader = new InputStreamReader(response, "UTF-8");
//                        JsonReader jsonReader = new JsonReader(responseReader);
//                        jsonReader.setLenient(true);
//
////                    jsonReader.beginArray(); // Start processing the JSON object
//                        String i = "";
//                        while (jsonReader.peek() != END_DOCUMENT) { // Loop through all keys
//                            if (jsonReader.peek() == NUMBER)
//                                RESTresponse = ""+jsonReader.nextLong();
//                        }
//                        jsonReader.close();
//                    } catch (IOException e) {
//                        e.printStackTrace();
//                    }
//                    myConnection.disconnect();
//                }
//
//
//
//            }
//        });

        final int[] secondsPasts = new int[1];
        Thread uiThread = new Thread(new Runnable() {

            public void run() {
                secondsPasts[0] = waitingTime / 1000;

                while (shouldRepeat) {
                    if (secondsPasts[0] < 0) {
                        secondsPasts[0] = waitingTime / 1000;
                    }
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
//                            mTimerText.setText(secondsPasts[0] + " s");
                            if (checkPermissions() && secondsPasts[0] == 0) {
                                startLocationUpdates();
                            }
                            mPairingText.setText(RESTresponse);

                        }
                    });
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    secondsPasts[0] = secondsPasts[0] - 1;
                }
            }
        });
        uiThread.start();
        AsyncTask.execute(urlThread1);

    }

    /**
     * Provides a simple way of getting a device's location and is well suited for
     * applications that do not require a fine-grained location and that do not need location
     * updates. Gets the best and most recent location currently available, which may be null
     * in rare cases when a location is not available.
     * <p>
     * Note: this method should be called after location permission has been granted.
     */
    @SuppressWarnings("MissingPermission")
    private void getLastLocation() {
        mFusedLocationClient.getLastLocation().addOnCompleteListener(this, new OnCompleteListener<Location>() {
            @Override
            public void onComplete(@NonNull Task<Location> task) {
                if (task.isSuccessful() && task.getResult() != null) {
                    mCurrentLocation = task.getResult();

                    mLatitudeText.setText(String.format(Locale.ENGLISH, "%s: %f",
                            mLatitudeLabel,
                            mCurrentLocation.getLatitude()));
                    mLongitudeText.setText(String.format(Locale.ENGLISH, "%s: %f",
                            mLongitudeLabel,
                            mCurrentLocation.getLongitude()));
                } else {
                    Log.w(TAG, "getLastLocation:exception", task.getException());
                    showSnackbar(getString(R.string.no_location_detected));
                }
            }
        });
    }

    protected LocationRequest createLocationRequest(int waitingTime) {
        LocationRequest locationRequest = LocationRequest.create();
        locationRequest.setInterval(waitingTime);
        locationRequest.setFastestInterval(waitingTime);
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        return locationRequest;
    }

    private void startLocationUpdates() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        mFusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, Looper.getMainLooper());
    }

    /**
     * Shows a {@link Snackbar} using {@code text}.
     *
     * @param text The Snackbar text.
     */
    private void showSnackbar(final String text) {
        View container = findViewById(R.id.main_activity_container);
        if (container != null) {
            Snackbar.make(container, text, Snackbar.LENGTH_LONG).show();
        }
    }

    /**
     * Shows a {@link Snackbar}.
     *
     * @param mainTextStringId The id for the string resource for the Snackbar text.
     * @param actionStringId   The text of the action item.
     * @param listener         The listener associated with the Snackbar action.
     */
    private void showSnackbar(final int mainTextStringId, final int actionStringId,
                              View.OnClickListener listener) {
        Snackbar.make(findViewById(android.R.id.content),
                getString(mainTextStringId),
                Snackbar.LENGTH_INDEFINITE)
                .setAction(getString(actionStringId), listener).show();
    }

    /**
     * Return the current state of the permissions needed.
     */
    private boolean checkPermissions() {
        int permissionState = ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION);
        return permissionState == PackageManager.PERMISSION_GRANTED;
    }

    private void startLocationPermissionRequest() {
        ActivityCompat.requestPermissions(MainActivity.this,
                new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                REQUEST_PERMISSIONS_REQUEST_CODE);
    }

    private void requestPermissions() {
        boolean shouldProvideRationale =
                ActivityCompat.shouldShowRequestPermissionRationale(this,
                        Manifest.permission.ACCESS_FINE_LOCATION);

        // Provide an additional rationale to the user. This would happen if the user denied the
        // request previously, but didn't check the "Don't ask again" checkbox.
        if (shouldProvideRationale) {
            Log.i(TAG, "Displaying permission rationale to provide additional context.");

            showSnackbar(R.string.permission_rationale, android.R.string.ok,
                    new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            // Request permission
                            startLocationPermissionRequest();
                        }
                    });

        } else {
            Log.i(TAG, "Requesting permission");
            // Request permission. It's possible this can be auto answered if device policy
            // sets the permission in a given state or the user denied the permission
            // previously and checked "Never ask again".
            startLocationPermissionRequest();
        }
    }

    /**
     * Callback received when a permissions request has been completed.
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        Log.i(TAG, "onRequestPermissionResult");
        if (requestCode == REQUEST_PERMISSIONS_REQUEST_CODE) {
            if (grantResults.length <= 0) {
                // If user interaction was interrupted, the permission request is cancelled and you
                // receive empty arrays.
                Log.i(TAG, "User interaction was cancelled.");
            } else if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted.
                getLastLocation();
            } else {
                // Permission denied.

                // Notify the user via a SnackBar that they have rejected a core permission for the
                // app, which makes the Activity useless. In a real app, core permissions would
                // typically be best requested during a welcome-screen flow.

                // Additionally, it is important to remember that a permission might have been
                // rejected without asking the user for permission (device policy or "Never ask
                // again" prompts). Therefore, a user interface affordance is typically implemented
                // when permissions are denied. Otherwise, your app could appear unresponsive to
                // touches or interactions which have required permissions.
                showSnackbar(R.string.permission_denied_explanation, R.string.settings,
                        new View.OnClickListener() {
                            @Override
                            public void onClick(View view) {
                                // Build intent that displays the App settings screen.
                                Intent intent = new Intent();
                                intent.setAction(
                                        Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                                Uri uri = Uri.fromParts("package",
                                        BuildConfig.APPLICATION_ID, null);
                                intent.setData(uri);
                                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                startActivity(intent);
                            }
                        });
            }
        }
    }
}