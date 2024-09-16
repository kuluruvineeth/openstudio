"use client";

import { OpenAiModelsResponse } from "@/app/api/ai/models/route";
import { UserResponse } from "@/app/api/user/me/route";
import { SaveSettingsResponse } from "@/app/api/user/settings/route";
import {
  saveSettingsBody,
  SaveSettingsBody,
} from "@/app/api/user/settings/validation";
import { api, postRequest } from "@/utils/api";
import { isError } from "@/utils/error";
import { modelOptions, Provider, providerOptions } from "@/utils/llms/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertError } from "@openstudio/ui/components/Alert";
import { Button } from "@openstudio/ui/components/Button";
import { FormSection, FormSectionLeft } from "@openstudio/ui/components/Form";
import { Input } from "@openstudio/ui/components/Input";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { Select } from "@openstudio/ui/components/Select";
import { toastError, toastSuccess } from "@openstudio/ui/components/Toast";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export function ModelSection() {
  const { data, isLoading, error, refetch } = useQuery<UserResponse>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get<UserResponse>("/user/me");
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: dataModels,
    isLoading: isLoadingModels,
    error: errorModels,
  } = useQuery<OpenAiModelsResponse | null>({
    queryKey: ["models"],
    queryFn: async () => {
      if (!data?.ai_api_key) {
        return null;
      }
      const response = await api.get<OpenAiModelsResponse>("/ai/models");
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <FormSection>
      <FormSectionLeft
        title="AI Model"
        description="Choose your AI model and use your own API key."
      />
      <LoadingContent loading={isLoading || isLoadingModels} error={error}>
        {data && (
          <ModelSectionForm
            aiProvider={data.ai_provider}
            aiModel={data.ai_model}
            aiApiKey={data.ai_api_key}
            models={dataModels!}
            refetchUser={refetch}
          />
        )}
      </LoadingContent>
    </FormSection>
  );
}

function getDefaultModel(aiProvider: string | null) {
  const provider = aiProvider || Provider.ANTHROPIC;
  const models = modelOptions[provider];
  return models?.[0]?.value;
}

function ModelSectionForm(props: {
  aiProvider?: string | null;
  aiModel?: string | null;
  aiApiKey?: string | null;
  models?: OpenAiModelsResponse;
  refetchUser: () => void;
}) {
  const { refetchUser } = props;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SaveSettingsBody>({
    resolver: zodResolver(saveSettingsBody),
    defaultValues: {
      aiProvider: props.aiProvider ?? Provider.ANTHROPIC,
      aiModel: props.aiModel ?? getDefaultModel(props.aiProvider!),
      aiApiKey: props.aiApiKey ?? undefined,
    },
  });

  const aiProvider = watch("aiProvider");

  useEffect(() => {
    const aiModel = watch("aiModel");
    // if model not part of provider then switch to default model for provider
    if (!modelOptions[aiProvider]?.find((o) => o.value === aiModel)) {
      setValue("aiModel", getDefaultModel(aiProvider)!);
    }
  }, [aiProvider, setValue, watch]);

  const onSubmit: SubmitHandler<SaveSettingsBody> = useCallback(
    async (data) => {
      const res = await postRequest<SaveSettingsResponse, SaveSettingsBody>(
        "/user/settings",
        data,
      );

      if (isError(res)) {
        toastError({
          description: "There was an error updating the settings.",
        });
      } else {
        toastSuccess({ description: "Settings updated!" });
      }

      refetchUser();
    },
    [refetchUser],
  );

  const globalError = (errors as any)[""];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        name="aiProvider"
        label="Provider"
        options={providerOptions}
        registerProps={register("aiProvider")}
        error={errors.aiProvider}
      />

      <Select
        name="aiModel"
        label="Model"
        options={
          aiProvider === Provider.OPEN_AI && watch("aiApiKey")
            ? props.models?.map((m) => ({
                label: m.id,
                value: m.id,
              })) || []
            : modelOptions[aiProvider ?? Provider.ANTHROPIC]!
        }
        registerProps={register("aiModel")}
        error={errors.aiModel}
      />

      <Input
        type="password"
        name="aiApiKey"
        label="API key"
        registerProps={register("aiApiKey")}
        error={errors.aiApiKey}
      />

      {globalError && (
        <AlertError title="Error saving" description={globalError.message} />
      )}

      <Button type="submit" loading={isSubmitting}>
        Save
      </Button>
    </form>
  );
}
