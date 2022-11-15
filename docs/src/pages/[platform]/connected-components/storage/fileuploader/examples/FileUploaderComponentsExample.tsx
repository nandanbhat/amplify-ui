import { FileUploader, View, Text } from '@aws-amplify/ui-react';

export const FileUploaderComponentsExample = () => {
  return (
    <FileUploader
      variation="drop"
      acceptedFileTypes={['image/*']}
      level="public"
      multiple={true}
      maxSize={100000000}
      maxFiles={3}
      components={{
        UploadDropZone: ({ inDropZone, children, ...rest }) => {
          return (
            <View
              padding="xl"
              backgroundColor={
                inDropZone ? 'brand.secondary.40' : 'brand.secondary.20'
              }
              {...rest}
            >
              <Text textAlign="center">Drop files here</Text>
            </View>
          );
        },
      }}
      provider="fast" // IGNORE
    />
  );
};
