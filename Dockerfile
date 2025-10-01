FROM openjdk:11-jdk

# Cài Node.js + Yarn
RUN apt-get update && apt-get install -y curl unzip git bash \
    && curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install --global yarn

# Cài Android SDK
ENV ANDROID_SDK_ROOT /opt/android-sdk
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools \
    && curl -fo sdk-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip \
    && unzip sdk-tools.zip -d $ANDROID_SDK_ROOT/cmdline-tools \
    && rm sdk-tools.zip

ENV PATH=$ANDROID_SDK_ROOT/cmdline-tools/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH

# Chấp nhận license
RUN yes | $ANDROID_SDK_ROOT/cmdline-tools/bin/sdkmanager --licenses

# Cài platform + build tools
RUN $ANDROID_SDK_ROOT/cmdline-tools/bin/sdkmanager "platform-tools" \
    "platforms;android-34" \
    "build-tools;34.0.0"

WORKDIR /app
