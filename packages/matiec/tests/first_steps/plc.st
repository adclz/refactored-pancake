TYPE
  LOGLEVEL : (CRITICAL, WARNING, INFO, DEBUG) := INFO;
END_TYPE

FUNCTION_BLOCK LOGGER
  VAR_INPUT
    TRIG : BOOL;
    MSG : STRING;
    LEVEL : LOGLEVEL := INFO;
  END_VAR
  VAR
    TRIG0 : BOOL;
  END_VAR

  IF TRIG AND NOT TRIG0 THEN
  {{
   LogMessage(GetFbVar(LEVEL),(char*)GetFbVar(MSG, .body),GetFbVar(MSG, .len));
  }}
  END_IF;
  TRIG0:=TRIG;
END_FUNCTION_BLOCK


FUNCTION AverageVal : REAL
  VAR_INPUT
    Cnt1 : INT;
    Cnt2 : INT;
    Cnt3 : INT;
    Cnt4 : INT;
    Cnt5 : INT;
  END_VAR
  VAR
    InputsNumber : REAL := 5.0;
  END_VAR

  AverageVal := INT_TO_REAL(Cnt1+Cnt2+Cnt3+Cnt4+Cnt5)/InputsNumber;
END_FUNCTION

FUNCTION_BLOCK CounterST
  VAR_INPUT
    Reset : BOOL;
  END_VAR
  VAR
    Cnt : INT;
  END_VAR
  VAR_OUTPUT
    OUT : INT;
  END_VAR
  VAR_EXTERNAL CONSTANT
    ResetCounterValue : INT;
  END_VAR

  IF Reset THEN
    Cnt := ResetCounterValue;
  ELSE
    Cnt := Cnt + 1;
  END_IF;

  Out := Cnt;
END_FUNCTION_BLOCK

FUNCTION_BLOCK CounterFBD
  VAR_INPUT
    Reset : BOOL;
  END_VAR
  VAR_OUTPUT
    OUT : INT;
  END_VAR
  VAR
    Cnt : INT;
  END_VAR
  VAR_EXTERNAL CONSTANT
    ResetCounterValue : INT;
  END_VAR
  VAR
    _TMP_ADD4_OUT : INT;
    _TMP_SEL7_OUT : INT;
  END_VAR

  OUT := Cnt;
  _TMP_ADD4_OUT := ADD(1, Cnt);
  _TMP_SEL7_OUT := SEL(Reset, _TMP_ADD4_OUT, ResetCounterValue);
  Cnt := _TMP_SEL7_OUT;
END_FUNCTION_BLOCK

FUNCTION_BLOCK CounterSFC
  VAR_INPUT
    Reset : BOOL;
  END_VAR
  VAR_OUTPUT
    OUT : INT;
  END_VAR
  VAR
    Cnt : INT;
  END_VAR
  VAR_EXTERNAL CONSTANT
    ResetCounterValue : INT;
  END_VAR

  INITIAL_STEP Start:
  END_STEP

  TRANSITION FROM Start TO ResetCounter
    := Reset;
  END_TRANSITION

  STEP ResetCounter:
    RESETCOUNTER_INLINE1(N);
    RESETCOUNTER_INLINE2(N);
  END_STEP

  ACTION RESETCOUNTER_INLINE1:
    Cnt := ResetCounterValue;
  END_ACTION

  ACTION RESETCOUNTER_INLINE2:
    OUT := Cnt;
  END_ACTION

  TRANSITION FROM ResetCounter TO Start
    := NOT Reset;
  END_TRANSITION

  TRANSITION FROM Start TO Count
    := NOT Reset;
  END_TRANSITION

  STEP Count:
    COUNT_INLINE3(N);
    COUNT_INLINE4(N);
  END_STEP

  ACTION COUNT_INLINE3:
    Cnt := Cnt + 1;
  END_ACTION

  ACTION COUNT_INLINE4:
    OUT := Cnt;
  END_ACTION

  TRANSITION FROM Count TO Start
    := Reset;
  END_TRANSITION

END_FUNCTION_BLOCK

FUNCTION_BLOCK CounterIL
  VAR
    Cnt : INT;
  END_VAR
  VAR_INPUT
    Reset : BOOL;
  END_VAR
  VAR_OUTPUT
    OUT : INT;
  END_VAR
  VAR_EXTERNAL CONSTANT
    ResetCounterValue : INT;
  END_VAR

  LD Reset
  JMPC ResetCnt

  (* increment counter *)
  LD Cnt
  ADD 1
  JMP QuitFb

  ResetCnt:
  (* reset counter *)
  LD ResetCounterValue

  QuitFb:
  (* save results *)
  ST Cnt
  ST Out
END_FUNCTION_BLOCK

FUNCTION_BLOCK CounterLD
  VAR_INPUT
    Reset : BOOL;
  END_VAR
  VAR_OUTPUT
    Out : INT;
  END_VAR
  VAR
    Cnt : INT;
  END_VAR
  VAR_EXTERNAL CONSTANT
    ResetCounterValue : INT;
  END_VAR
  VAR
    _TMP_ADD4_OUT : INT;
    _TMP_SEL7_OUT : INT;
  END_VAR

  Out := Cnt;
  _TMP_ADD4_OUT := ADD(1, Cnt);
  _TMP_SEL7_OUT := SEL(Reset, _TMP_ADD4_OUT, ResetCounterValue);
  Cnt := _TMP_SEL7_OUT;
END_FUNCTION_BLOCK

PROGRAM plc_prg
  VAR_INPUT
    Reset : BOOL;
  END_VAR
  VAR_OUTPUT
    Cnt1 : INT;
    Cnt2 : INT;
    Cnt3 : INT;
    Cnt4 : INT;
    Cnt5 : INT;
  END_VAR
  VAR
    CounterST0 : CounterST;
    CounterFBD0 : CounterFBD;
    CounterSFC0 : CounterSFC;
    CounterIL0 : CounterIL;
    CounterLD0 : CounterLD;
    AVCnt : REAL;
    _TMP_AverageVal17_OUT : REAL;
  END_VAR

  _TMP_AverageVal17_OUT := AverageVal(Cnt1, Cnt2, Cnt3, Cnt4, Cnt5);
  AVCnt := _TMP_AverageVal17_OUT;
  CounterST0(Reset := Reset);
  Cnt1 := CounterST0.OUT;
  CounterFBD0(Reset := Reset);
  Cnt2 := CounterFBD0.OUT;
  CounterSFC0(Reset := Reset);
  Cnt3 := CounterSFC0.OUT;
  CounterIL0(Reset := Reset);
  Cnt4 := CounterIL0.OUT;
  CounterLD0(Reset := Reset);
  Cnt5 := CounterLD0.Out;
END_PROGRAM


CONFIGURATION config
  VAR_GLOBAL CONSTANT
    ResetCounterValue : INT := 17;
  END_VAR

  RESOURCE resource1 ON PLC
    TASK plc_task(INTERVAL := T#100ms,PRIORITY := 1);
    PROGRAM plc_task_instance WITH plc_task : plc_prg;
  END_RESOURCE
END_CONFIGURATION
