'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, Typography, Grid, Skeleton, AspectRatio, Box, aspectRatioClasses } from '@/lib/mui';
import { useRequest } from 'ahooks';
import { sendGetRequest, sendPostRequest } from '@/utils/request';
import useAgentChat from '@/hooks/useAgentChat';
import ChatBoxComp from '@/components/chatBoxTemp';
import { useDialogueContext } from '@/app/context/dialogue';
import { useSearchParams } from 'next/navigation';
import { ChartData } from '@/types/chart';
import LineChart from './Chart/LineChart';
import BarChart from './Chart/BarChart';
import TableChart from './Chart/TableChart';

const ChartSkeleton = () => {
  return (
    <Card className="h-full w-full flex bg-transparent">
      <Skeleton animation="wave" variant="text" level="body2" />
      <Skeleton animation="wave" variant="text" level="body2" />
      <AspectRatio
        ratio="21/9"
        className="flex-1"
        sx={{
          [`& .${aspectRatioClasses.content}`]: {
            height: '100%',
          },
        }}
      >
        <Skeleton variant="overlay" className="h-full" />
      </AspectRatio>
    </Card>
  );
};

const ChatMode = () => {
  const [chartsData, setChartsData] = useState<Array<ChartData>>();
  const buttonRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const searchParams = useSearchParams();
  const { dialogueList, refreshDialogList } = useDialogueContext();
  const id = searchParams.get('id');
  const scene = searchParams.get('scene');

  const currentDialogue = useMemo(() => ((dialogueList?.data ?? []) as any[]).find((item) => item.conv_uid === id), [id, dialogueList]);

  const { data: historyList, run: runHistoryList } = useRequest(
    async () =>
      await sendGetRequest('/v1/chat/dialogue/messages/history', {
        con_uid: id,
      }),
    {
      ready: !!id,
      refreshDeps: [id],
    },
  );

  const { data: dbList, run: runDbList } = useRequest(async () => await sendGetRequest('/v1/chat/db/list'), {
    ready: !!scene && !!['chat_with_db_execute', 'chat_with_db_qa'].includes(scene),
  });

  const { data: supportTypes } = useRequest(async () => await sendGetRequest('/v1/chat/db/support/type'), {
    ready: !!scene && !!['chat_with_db_execute', 'chat_with_db_qa'].includes(scene),
  });

  const { history, handleChatSubmit } = useAgentChat({
    queryAgentURL: `/v1/chat/completions`,
    queryBody: {
      conv_uid: id,
      chat_mode: scene || 'chat_normal',
    },
    initHistory: historyList?.data,
    runHistoryList,
  });

  const { data: paramsList, run: runParamsList } = useRequest(async () => await sendPostRequest(`/v1/chat/mode/params/list?chat_mode=${scene}`), {
    ready: !!scene,
    refreshDeps: [id, scene],
  });


  const renderChart = (json: any) =>{
    let charts = json?.charts;
    let res = [];
      // 若是有类型为 IndicatorValue 的，提出去，独占一行
      const chartCalc = charts?.filter((item) => item.chart_type === 'IndicatorValue');
      if (chartCalc.length > 0) {
        res.push({
          charts: chartCalc,
          type: 'IndicatorValue',
        });
      }
      let otherCharts = charts?.filter((item) => item.chart_type !== 'IndicatorValue');
      let otherLength = otherCharts.length;
      let curIndex = 0;
      // charts 数量 3～8个，暂定每行排序
      let chartLengthMap = [[0], [1], [2], [1, 2], [1, 3], [2, 1, 2], [2, 1, 3], [3, 1, 3], [3, 2, 3]];
      chartLengthMap[otherLength].forEach((item) => {
        if (item > 0) {
          const rowsItem = otherCharts.slice(curIndex, curIndex + item);
          curIndex = curIndex + item;
          res.push({
            charts: rowsItem,
          });
        }
      });     
    return (
      <>
      {res && (
        <Grid xs={8} className="max-h-full">
          <div className="flex flex-col gap-3 h-full">
            {res?.map((chartRow, index) => (
              <div key={`chart_row_${index}`} className={`${chartRow?.type !== 'IndicatorValue' ? 'flex gap-3' : ''}`}>
                {chartRow.charts.map((chart) => {
                  if (chart.chart_type === 'IndicatorValue') {
                    return (
                      <div key={chart.chart_uid} className="flex flex-row gap-3">
                        {chart.values.map((item) => (
                          <div key={item.name} className="flex-1">
                            <Card sx={{ background: 'transparent' }}>
                              <CardContent className="justify-around">
                                <Typography gutterBottom component="div">
                                  {item.name}
                                </Typography>
                                <Typography>{item.value}</Typography>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    );
                  } else if (chart.chart_type === 'LineChart') {
                    return <LineChart key={chart.chart_uid} chart={chart} />;
                  } else if (chart.chart_type === 'BarChart') {
                    return <BarChart key={chart.chart_uid} chart={chart} />;
                  } else if (chart.chart_type === 'Table') {
                    return <TableChart key={chart.chart_uid} chart={chart} />;
                  }
                })}
              </div>
            ))}
          </div>
        </Grid>
      )}
      </>
    )  
  }

  return (
    <Grid container spacing={2} className="h-full overflow-auto" sx={{ flexGrow: 1 }}>      
      <Grid xs={12} className="h-full max-h-full">
        <div className="h-full" style={{ boxShadow: 'unset' }}>
          <ChatBoxComp
            clearIntialMessage={async () => {
              await refreshDialogList();
            }}
            dialogue={currentDialogue}
            dbList={dbList?.data}
            runDbList={runDbList}
            onRefreshHistory={runHistoryList}
            supportTypes={supportTypes?.data}
            messages={history || []}
            onSubmit={handleChatSubmit}
            paramsList={paramsList?.data}
            runParamsList={runParamsList}
            setChartsData={renderChart}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default ChatMode;
